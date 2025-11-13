# System Architecture - Enterprise CRM

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js 14 App (React 18 + TypeScript)             │   │
│  │  - Server Components (default)                        │   │
│  │  - Client Components ('use client')                   │   │
│  │  - shadcn/ui + Tailwind CSS                          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓  HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                APPLICATION LAYER (Next.js)                   │
│  ┌─────────────────┐  ┌──────────────────────────────┐     │
│  │  API Routes      │  │   Server Components          │     │
│  │  /api/*         │  │   - Data fetching             │     │
│  │                 │  │   - Server-side rendering     │     │
│  │  Middleware:     │  └──────────────────────────────┘     │
│  │  - Auth          │                                        │
│  │  - Rate Limiting │  ┌──────────────────────────────┐     │
│  │  - Validation    │  │   Background Jobs (BullMQ)    │     │
│  │  - RBAC          │  │   - Email queue               │     │
│  └─────────────────┘  │   - Import queue              │     │
│                       │   - Report queue              │     │
│                       └──────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                ↓                    ↓                  ↓
┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐
│   PostgreSQL 15   │  │   Redis Cache     │  │  AWS S3 Storage │
│                  │  │                  │  │                 │
│  - Users         │  │  - Sessions       │  │  - Attachments  │
│  - Contacts      │  │  - Cache          │  │  - Documents    │
│  - Deals         │  │  - Job Queues     │  │  - Exports      │
│  - Activities    │  │  - Rate Limits    │  │                 │
│  - Tasks         │  │                  │  │                 │
│  - Audit Logs    │  │                  │  │                 │
└──────────────────┘  └──────────────────┘  └─────────────────┘
```

## 🏗️ Application Architecture

### 1. Frontend Layer (Next.js App Router)

#### Server Components (Default)
- **Benefits**: Zero JavaScript to client, data fetching on server, direct database access
- **Use cases**: Static pages, data-heavy pages, SEO-critical content
- **Location**: Most pages in `app/` directory

```typescript
// app/dashboard/page.tsx (Server Component)
export default async function DashboardPage() {
  const stats = await getStats(); // Direct database call
  return <StatsDisplay stats={stats} />;
}
```

#### Client Components ('use client')
- **Benefits**: Interactivity, state management, browser APIs
- **Use cases**: Forms, interactive widgets, real-time updates
- **Location**: Components with useState, useEffect, event handlers

```typescript
// components/contact-form.tsx (Client Component)
'use client';
export default function ContactForm() {
  const [name, setName] = useState('');
  return <input value={name} onChange={e => setName(e.target.value)} />;
}
```

### 2. API Routes Layer

#### Route Structure
```
app/api/
├── auth/
│   ├── [...nextauth]/     # NextAuth.js endpoints
│   └── register/          # Registration
├── contacts/
│   ├── route.ts           # GET (list), POST (create)
│   ├── [id]/route.ts      # GET, PATCH, DELETE
│   ├── import/route.ts    # POST (bulk import)
│   └── export/route.ts    # GET (export to CSV)
├── deals/
│   ├── route.ts
│   ├── [id]/route.ts
│   └── pipeline/route.ts
├── activities/
├── tasks/
├── emails/
└── reports/
```

#### Request Flow
```
Request → Rate Limiter → Authentication → Authorization → Validation → Business Logic → Response
```

#### API Response Format
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### 3. Data Layer

#### Sequelize ORM Models

```typescript
// lib/models/Contact.ts
Contact.init({
  id: { type: DataTypes.UUID, primaryKey: true },
  first_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  company_id: { type: DataTypes.UUID, allowNull: false },
  // ... other fields
}, {
  sequelize,
  tableName: 'contacts',
  indexes: [
    { fields: ['company_id', 'owner_id'] },
    { fields: ['email'] },
  ],
});
```

#### Model Relationships
```typescript
// lib/models/index.ts
Company.hasMany(Contact, { foreignKey: 'company_id' });
Contact.belongsTo(Company, { foreignKey: 'company_id' });

User.hasMany(Contact, { foreignKey: 'owner_id', as: 'owned_contacts' });
Contact.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
```

## 🔐 Security Architecture

### Authentication Flow

```
1. User submits credentials → POST /api/auth/login
2. NextAuth validates credentials → Queries database
3. Generate JWT token → Store in HTTP-only cookie
4. Return session to client
5. Subsequent requests include cookie → Middleware validates token
```

### Authorization Layers

#### 1. Route-level Authorization
```typescript
// Require authentication
const user = await requireAuth(request);
if (user instanceof NextResponse) return user;
```

#### 2. Role-based Access Control (RBAC)
```typescript
// Require admin role
const user = await requireAdmin(request);
```

#### 3. Resource-level Authorization
```typescript
// Ensure user owns resource
if (resource.company_id !== user.company_id) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

### Multi-tenant Isolation

```typescript
// Every query automatically scoped to company
const contacts = await Contact.findAll({
  where: {
    company_id: user.company_id, // Injected from session
    status: 'active'
  }
});
```

## 💾 Caching Strategy

### Cache Layers

#### 1. Redis Cache
```typescript
// lib/cache/redis.ts
const cacheKey = `contacts:list:${companyId}:${page}:${filters}`;

// Try cache first
const cached = await cache.get(cacheKey);
if (cached) return cached;

// Fetch from database
const data = await Contact.findAll({ ... });

// Store in cache with TTL
await cache.set(cacheKey, data, CACHE_TTL.MEDIUM); // 5 minutes
```

#### 2. Next.js Cache
```typescript
// Server Component with cache
export const revalidate = 300; // 5 minutes

export default async function Page() {
  const data = await fetch('...', { next: { revalidate: 300 } });
  return <div>{data}</div>;
}
```

### Cache Invalidation

```typescript
// After mutation, invalidate related caches
await cache.delPattern(`contacts:list:${companyId}:*`);
await cache.delPattern(`dashboard:stats:${companyId}`);
```

### TTL Strategy
- **Dashboard stats**: 5 minutes
- **User permissions**: 15 minutes
- **Company settings**: 30 minutes
- **List queries**: 5 minutes
- **Report results**: 10 minutes

## 🚀 Performance Optimizations

### Database Optimizations

#### 1. Indexes
```sql
CREATE INDEX idx_contacts_company_owner ON contacts(company_id, owner_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_deals_stage ON deals(company_id, stage);
```

#### 2. Query Optimization
```typescript
// Include related data in one query (prevent N+1)
const contacts = await Contact.findAll({
  where: { company_id },
  include: [
    { model: User, as: 'owner', attributes: ['id', 'name'] },
    { model: Deal, as: 'deals', limit: 5 },
  ],
  limit: 20,
  offset: 0,
});
```

#### 3. Pagination
```typescript
// Cursor-based pagination for large datasets
const contacts = await Contact.findAll({
  where: {
    company_id,
    created_at: { [Op.lt]: cursor }
  },
  limit: 20,
  order: [['created_at', 'DESC']],
});
```

### Frontend Optimizations

#### 1. Code Splitting
```typescript
// Dynamic imports for large components
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});
```

#### 2. Image Optimization
```typescript
import Image from 'next/image';

<Image
  src="/avatar.jpg"
  width={100}
  height={100}
  alt="Avatar"
  priority // For above-the-fold images
/>
```

## 🔄 Background Jobs Architecture

### BullMQ Queue System

```typescript
// workers/index.ts
import { Queue, Worker } from 'bullmq';

// Define queues
const emailQueue = new Queue('emails', { connection: redis });
const importQueue = new Queue('imports', { connection: redis });

// Define workers
const emailWorker = new Worker('emails', async (job) => {
  const { to, subject, body } = job.data;
  await sendEmail(to, subject, body);
}, { connection: redis });

// Add jobs
await emailQueue.add('send-email', {
  to: 'user@example.com',
  subject: 'Welcome',
  body: 'Hello!'
});
```

### Job Types

1. **Email Queue**: Send transactional emails, newsletters
2. **Import Queue**: Process CSV/Excel uploads
3. **Report Queue**: Generate complex reports
4. **Analytics Queue**: Daily/weekly data aggregation
5. **Cleanup Queue**: Archive old data, delete temporary files

## 📊 Monitoring & Observability

### Application Metrics

```typescript
// Track key metrics
- API response times (p50, p95, p99)
- Error rates by endpoint
- Cache hit/miss ratio
- Database query performance
- Active sessions
- Background job success rate
```

### Logging Strategy

```typescript
// Structured logging
console.log({
  level: 'info',
  timestamp: new Date().toISOString(),
  userId: user.id,
  action: 'contact_created',
  contactId: contact.id,
  duration: 123, // ms
});
```

### Error Tracking

```typescript
// Sentry integration
import * as Sentry from '@sentry/nextjs';

Sentry.captureException(error, {
  tags: { endpoint: '/api/contacts' },
  user: { id: userId, email: userEmail },
  extra: { requestBody: body },
});
```

## 🔒 Audit Logging

### Audit Trail

```typescript
// Log all critical actions
await AuditLog.create({
  company_id: user.company_id,
  user_id: user.id,
  action: 'updated',
  entity_type: 'contact',
  entity_id: contact.id,
  changes: {
    before: { status: 'lead' },
    after: { status: 'customer' },
  },
  ip_address: request.ip,
  user_agent: request.headers.get('user-agent'),
});
```

## 📱 Real-time Features

### Server-Sent Events (SSE)

```typescript
// app/api/notifications/stream/route.ts
export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    async start(controller) {
      const interval = setInterval(async () => {
        const notifications = await getUnreadNotifications(userId);
        controller.enqueue(`data: ${JSON.stringify(notifications)}\n\n`);
      }, 5000);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

## 🧪 Testing Strategy

### Unit Tests
- Utility functions
- Validation schemas
- Business logic

### Integration Tests
- API endpoints
- Database queries
- Authentication flow

### E2E Tests
- User workflows
- Critical paths
- Form submissions

## 📈 Scalability Considerations

### Horizontal Scaling

#### Application Tier
- Stateless API design
- Session storage in Redis
- Load balancer distribution

#### Database Tier
- Read replicas for reporting
- Connection pooling (PgBouncer)
- Partitioning for large tables

### Vertical Scaling

#### Capacity Planning (1000 users)
```
Application Servers:
- 2-4 vCPU, 4-8GB RAM per instance
- 2-3 instances (redundancy)

Database:
- 4 vCPU, 8GB RAM
- 100GB SSD storage
- 100 max connections

Redis:
- 1GB memory
- Persistence enabled

Storage:
- 50-100GB for attachments
```

## 🎯 Future Enhancements

### Phase 2 Features
- WebSocket for real-time collaboration
- Advanced reporting with data visualization
- Mobile app (React Native)
- AI-powered lead scoring
- Third-party integrations (Zapier, Salesforce)
- Advanced automation workflows
- Custom field builder
- Multi-language support
- White-label capabilities

### Technical Improvements
- GraphQL API option
- Event sourcing for audit trail
- CQRS pattern for complex queries
- Microservices architecture for scale
- Edge function optimization
- Progressive Web App (PWA)

---

This architecture is designed to scale from startup to enterprise with 1000+ users while maintaining performance, security, and reliability.

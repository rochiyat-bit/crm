# Enterprise CRM System - Next.js 14+

A production-ready, full-featured Customer Relationship Management (CRM) system built with Next.js 14+, TypeScript, PostgreSQL, Redis, and modern web technologies.

## 🚀 Features

### Core Functionality
- **Contact Management** - Comprehensive contact database with custom fields, tags, and lead scoring
- **Deal Pipeline** - Visual kanban board with drag-and-drop, multiple pipelines, and win/loss tracking
- **Activity Tracking** - Call logs, meetings, tasks, and notes with timeline views
- **Email Integration** - Send, track, and template emails directly from the CRM
- **Task Management** - Assign tasks, set priorities, and track completion
- **Reports & Analytics** - Sales dashboards, pipeline analytics, and custom report builder
- **Multi-tenant Architecture** - Secure company isolation with role-based access control

### Technical Features
- **Authentication** - NextAuth.js with JWT, role-based access, and OAuth support
- **Real-time Updates** - Server-Sent Events for live collaboration
- **Caching Layer** - Redis caching for optimal performance
- **Background Jobs** - BullMQ for email sending, imports, and data processing
- **Security** - Rate limiting, input validation, CSRF protection, and audit logging
- **API Routes** - RESTful API with pagination, filtering, and search
- **Database** - PostgreSQL with Sequelize ORM, migrations, and optimized indexes
- **UI/UX** - shadcn/ui components, Tailwind CSS, responsive design

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.17.0 or higher
- **npm** 9.0.0 or higher
- **PostgreSQL** 15 or higher
- **Redis** 7.0 or higher
- **Git**

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd crm
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/crm_db

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-minimum-32-characters
NEXTAUTH_URL=http://localhost:3000

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# AWS S3 Storage (Optional)
AWS_S3_BUCKET=crm-attachments
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Rate Limiting
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100
```

### 4. Database Setup

#### Option A: Using PostgreSQL Locally

```bash
# Create database
createdb crm_db

# Run migrations (synchronize models)
npm run db:migrate

# Seed initial data
npm run db:seed
```

#### Option B: Using Managed PostgreSQL (Recommended for Production)

Use services like:
- **Supabase** - https://supabase.com
- **Neon** - https://neon.tech
- **Railway** - https://railway.app

Just update your `DATABASE_URL` in `.env`.

### 5. Redis Setup

#### Option A: Using Redis Locally

```bash
# Install Redis (macOS)
brew install redis

# Start Redis
brew services start redis
```

#### Option B: Using Upstash (Recommended for Production)

1. Create account at https://upstash.com
2. Create Redis database
3. Copy connection URL to `REDIS_URL` in `.env`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
crm/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   │   ├── [...nextauth]/   # NextAuth configuration
│   │   │   └── register/        # Registration endpoint
│   │   ├── contacts/            # Contact API routes
│   │   ├── deals/               # Deal API routes
│   │   ├── activities/          # Activity API routes
│   │   ├── tasks/               # Task API routes
│   │   ├── emails/              # Email API routes
│   │   └── reports/             # Report API routes
│   ├── dashboard/               # Dashboard pages
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── providers/               # Context providers
│   ├── dashboard/               # Dashboard components
│   ├── contacts/                # Contact components
│   ├── deals/                   # Deal components
│   └── shared/                  # Shared components
├── lib/                         # Library code
│   ├── db/                      # Database configuration
│   ├── models/                  # Sequelize models
│   ├── cache/                   # Redis caching
│   ├── middleware/              # Middleware functions
│   ├── validations/             # Zod validation schemas
│   └── utils/                   # Utility functions
├── types/                       # TypeScript type definitions
├── workers/                     # Background job workers
├── scripts/                     # Utility scripts
├── public/                      # Static assets
└── package.json
```

## 🗄️ Database Schema

### Core Tables

1. **companies** - Multi-tenant company data
2. **users** - User accounts with role-based access
3. **contacts** - Customer contact information
4. **deals** - Sales opportunities
5. **pipelines** - Customizable sales pipelines
6. **activities** - Interaction tracking (calls, meetings, etc.)
7. **tasks** - Task management
8. **emails** - Email tracking and templates
9. **notes** - Notes attached to contacts/deals
10. **audit_logs** - Complete audit trail
11. **notifications** - User notifications

### Relationships

- Companies have many Users, Contacts, Deals, Pipelines
- Users own Contacts, Deals, Activities, Tasks
- Contacts have many Deals, Activities, Tasks
- Deals belong to Pipeline and Contact
- Activities and Tasks link to Contacts and Deals

## 🔐 Authentication & Authorization

### User Roles

- **super_admin** - Full system access
- **admin** - Company-wide administration
- **manager** - Team management and reports
- **sales** - Standard sales user
- **support** - Customer support access

### Protected Routes

All API routes require authentication. Use the middleware:

```typescript
import { requireAuth, requireRole } from '@/lib/middleware/auth';

// Require authentication
const user = await requireAuth(request);

// Require specific role
const user = await requireRole(['admin', 'manager'])(request);
```

## 📊 API Documentation

### Authentication Endpoints

```
POST /api/auth/register     - Create new account
POST /api/auth/login        - Sign in (handled by NextAuth)
POST /api/auth/logout       - Sign out
```

### Contact Endpoints

```
GET    /api/contacts              - List contacts (paginated, filtered)
POST   /api/contacts              - Create contact
GET    /api/contacts/:id          - Get single contact
PATCH  /api/contacts/:id          - Update contact
DELETE /api/contacts/:id          - Delete contact
GET    /api/contacts/:id/timeline - Get contact activity timeline
POST   /api/contacts/import       - Bulk import contacts
GET    /api/contacts/export       - Export contacts (CSV/Excel)
```

### Deal Endpoints

```
GET    /api/deals              - List deals
POST   /api/deals              - Create deal
GET    /api/deals/:id          - Get deal details
PATCH  /api/deals/:id          - Update deal
DELETE /api/deals/:id          - Delete deal
PATCH  /api/deals/:id/stage    - Move deal to different stage
GET    /api/deals/pipeline     - Get pipeline view
GET    /api/deals/forecast     - Sales forecast
```

### Query Parameters

All list endpoints support:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `search` - Search query
- `status` - Filter by status
- `owner_id` - Filter by owner
- `sort` - Sort field
- `order` - Sort order (asc/desc)

Example:
```
GET /api/contacts?page=1&limit=20&status=customer&search=john
```

## 🎨 Frontend Development

### Adding New Pages

Create pages in the app directory following the Next.js 14 App Router conventions:

```typescript
// app/contacts/page.tsx
export default function ContactsPage() {
  return <div>Contacts List</div>;
}
```

### Using API Routes

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function ContactsList() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => setContacts(data.data));
  }, []);

  return (
    <div>
      {contacts.map(contact => (
        <div key={contact.id}>{contact.first_name} {contact.last_name}</div>
      ))}
    </div>
  );
}
```

### Using shadcn/ui Components

```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function MyComponent() {
  return (
    <Card>
      <Button variant="default">Click me</Button>
    </Card>
  );
}
```

## 🔧 Background Jobs

### Setting Up Workers

```bash
# Start background worker
npm run worker
```

### Available Jobs

1. **Email Queue** - Send emails asynchronously
2. **Import Queue** - Process CSV/Excel imports
3. **Report Queue** - Generate complex reports
4. **Analytics Queue** - Daily data aggregation
5. **Cleanup Queue** - Archive old data

### Adding New Jobs

```typescript
// workers/email.queue.ts
import { Queue, Worker } from 'bullmq';
import { connectRedis } from '@/lib/cache/redis';

const emailQueue = new Queue('emails', {
  connection: await connectRedis(),
});

const worker = new Worker('emails', async (job) => {
  const { to, subject, body } = job.data;
  // Send email logic here
}, {
  connection: await connectRedis(),
});
```

## 📈 Performance Optimization

### Caching Strategy

```typescript
import { cache, cacheKeys, CACHE_TTL } from '@/lib/cache/redis';

// Cache dashboard stats for 5 minutes
const stats = await cache.get(cacheKeys.dashboardStats(companyId));
if (!stats) {
  const freshStats = await calculateStats();
  await cache.set(cacheKeys.dashboardStats(companyId), freshStats, CACHE_TTL.MEDIUM);
}
```

### Database Optimization

- Use indexes on frequently queried fields
- Implement pagination for large datasets
- Use eager loading to prevent N+1 queries
- Consider read replicas for heavy reporting

## 🧪 Testing

```bash
# Run tests (to be implemented)
npm test

# Run type check
npm run type-check

# Run linter
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Ensure all production environment variables are set:

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `NEXTAUTH_SECRET` - Random secret (min 32 chars)
- `NEXTAUTH_URL` - Your production URL
- `RESEND_API_KEY` - Email service API key

### Database Migration

```bash
# Run migrations on production database
DATABASE_URL=your_production_url npm run db:migrate
```

## 📚 Additional Resources

### Technologies Used

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Sequelize](https://sequelize.org/)
- [Redis](https://redis.io/)
- [BullMQ](https://docs.bullmq.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zod](https://zod.dev/)

### Extending the System

#### Adding New Models

1. Create model in `lib/models/YourModel.ts`
2. Add relationships in `lib/models/index.ts`
3. Create validation schema in `lib/validations/yourModel.ts`
4. Create API routes in `app/api/your-model/`
5. Build UI components in `components/your-model/`
6. Create pages in `app/your-model/`

#### Adding New API Routes

```typescript
// app/api/your-route/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  const user = await requireAuth(request);
  if (user instanceof NextResponse) return user;

  // Your logic here

  return NextResponse.json({ success: true, data: [] });
}
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test database connection
psql postgresql://user:password@localhost:5432/crm_db
```

### Redis Connection Issues

```bash
# Test Redis connection
redis-cli ping
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill
```

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review the code examples

---

Built with ❤️ using Next.js 14+ and modern web technologies.

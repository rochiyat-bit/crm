# Deployment Guide - Enterprise CRM System

This guide covers deploying the Enterprise CRM System to production environments.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended for Next.js)

Vercel provides the best experience for Next.js applications with automatic scaling and CDN distribution.

#### Prerequisites
- GitHub account
- Vercel account (free tier available)
- PostgreSQL database (Supabase/Neon/Railway)
- Redis instance (Upstash)

#### Steps

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. **Import Project in Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select Next.js as framework

3. **Configure Environment Variables**

   Add these in Vercel project settings:

   ```env
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

   DATABASE_URL=postgresql://...
   REDIS_URL=redis://...

   NEXTAUTH_SECRET=<generate-32-char-secret>
   NEXTAUTH_URL=https://your-domain.vercel.app

   RESEND_API_KEY=your_key
   RESEND_FROM_EMAIL=noreply@yourdomain.com

   AWS_S3_BUCKET=your-bucket
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your deployed URL

5. **Run Database Migration**
   ```bash
   # Connect to production database and run migrations
   DATABASE_URL=your_production_url npm run db:migrate
   ```

### Option 2: Docker Deployment

Use Docker for containerized deployment on any cloud provider.

#### Dockerfile

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/crm
      - REDIS_URL=redis://redis:6379
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=crm
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Option 3: AWS Deployment

Deploy on AWS using EC2, RDS, and ElastiCache.

#### Architecture
- **EC2** - Application server
- **RDS PostgreSQL** - Database
- **ElastiCache Redis** - Caching
- **S3** - File storage
- **CloudFront** - CDN
- **ALB** - Load balancer

#### Setup Steps

1. **Create RDS PostgreSQL Instance**
   - Engine: PostgreSQL 15
   - Instance: db.t3.micro (dev) or larger
   - Storage: 20GB SSD
   - Enable automated backups

2. **Create ElastiCache Redis**
   - Engine: Redis 7.x
   - Node type: cache.t3.micro (dev) or larger
   - Enable automatic backups

3. **Create S3 Bucket**
   - Bucket name: your-crm-attachments
   - Enable versioning
   - Set CORS policy

4. **Launch EC2 Instance**
   - AMI: Amazon Linux 2023
   - Instance type: t3.small or larger
   - Install Node.js 18+
   - Install PM2 for process management

5. **Deploy Application**
   ```bash
   # On EC2 instance
   git clone your-repo
   cd crm
   npm install
   npm run build

   # Start with PM2
   pm2 start npm --name "crm" -- start
   pm2 startup
   pm2 save
   ```

## 🗄️ Database Setup

### PostgreSQL Options

#### Supabase (Recommended)
- Free tier: 500MB database, 1GB bandwidth
- Automatic backups
- Built-in connection pooling
- Global CDN

1. Create account at https://supabase.com
2. Create new project
3. Copy connection string
4. Update `DATABASE_URL` in environment

#### Neon
- Serverless PostgreSQL
- Free tier: 3GB storage
- Instant branching
- Autoscaling

1. Create account at https://neon.tech
2. Create database
3. Copy connection string

#### Railway
- All-in-one platform
- PostgreSQL + Redis included
- $5/month hobby tier

### Running Migrations

```bash
# Development
npm run db:migrate

# Production (Vercel)
vercel env pull .env.local
DATABASE_URL=production_url npm run db:migrate

# Production (SSH to server)
ssh user@server
cd /path/to/app
npm run db:migrate
```

## 💾 Redis Setup

### Upstash (Recommended)
- Serverless Redis
- Free tier: 10K commands/day
- Global replication
- REST API

1. Create account at https://upstash.com
2. Create Redis database
3. Copy connection URL
4. Update `REDIS_URL`

### Redis Cloud
- Free tier: 30MB
- High availability
- Automatic backups

### AWS ElastiCache
- Managed Redis service
- VPC isolation
- Multi-AZ replication

## 📧 Email Service Setup

### Resend (Recommended)
1. Sign up at https://resend.com
2. Verify domain
3. Create API key
4. Update environment variables:
   ```env
   RESEND_API_KEY=re_xxx
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```

### SendGrid Alternative
```env
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

## 📦 File Storage Setup

### AWS S3

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-crm-attachments
   ```

2. **Set CORS Policy**
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["https://your-domain.com"],
       "ExposeHeaders": ["ETag"]
     }
   ]
   ```

3. **Create IAM User**
   - Attach S3 policy with read/write permissions
   - Generate access keys
   - Add to environment variables

## 🔒 Security Checklist

- [ ] Set strong `NEXTAUTH_SECRET` (minimum 32 characters)
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable database SSL connections
- [ ] Implement backup strategy
- [ ] Set up monitoring and alerts
- [ ] Configure firewall rules
- [ ] Enable audit logging
- [ ] Regular security updates

## 📊 Monitoring & Logging

### Vercel Analytics
- Built-in analytics
- Web vitals monitoring
- Real-time logs

### Sentry (Error Tracking)
1. Create account at https://sentry.io
2. Create project
3. Add environment variables:
   ```env
   SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   ```

### LogDNA / Datadog
- Application logs
- Performance metrics
- Custom dashboards

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🎯 Performance Optimization

### Database
- Enable connection pooling
- Create necessary indexes
- Set up read replicas for reports
- Regular VACUUM and ANALYZE

### Caching
- Configure Redis persistence
- Set appropriate TTL values
- Implement cache warming

### CDN
- CloudFlare or Vercel Edge Network
- Cache static assets
- Enable compression

## 🔧 Maintenance

### Backups
- **Database**: Daily automated backups
- **Files**: S3 versioning enabled
- **Redis**: Periodic snapshots

### Updates
```bash
# Update dependencies
npm update

# Security audit
npm audit fix

# Database migration
npm run db:migrate
```

### Scaling

#### Horizontal Scaling
- Add more application instances
- Use load balancer
- Session management via Redis

#### Vertical Scaling
- Increase server resources
- Upgrade database tier
- Scale Redis instance

## 📞 Support & Troubleshooting

### Common Issues

**Database Connection Timeout**
```bash
# Increase connection pool size in lib/db/config.ts
pool: {
  max: 30,
  min: 10,
  acquire: 60000,
}
```

**Redis Connection Issues**
```bash
# Check Redis connectivity
redis-cli -u $REDIS_URL ping
```

**Build Failures**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## 🎉 Post-Deployment

After successful deployment:

1. Test all critical features
2. Create admin account
3. Import initial data
4. Configure integrations
5. Set up monitoring alerts
6. Document custom configurations
7. Train team members

---

**Need help?** Open an issue in the repository or check the documentation.

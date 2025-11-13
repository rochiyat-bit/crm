export type UserRole = 'super_admin' | 'admin' | 'manager' | 'sales' | 'support';

export type CompanySize = 'small' | 'medium' | 'large' | 'enterprise';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export type ContactStatus = 'lead' | 'prospect' | 'customer' | 'inactive';

export type LeadSource = 'website' | 'referral' | 'cold_call' | 'marketing' | 'partner';

export type DealStage =
  | 'prospecting'
  | 'qualification'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export type ActivityType = 'call' | 'email' | 'meeting' | 'task' | 'note' | 'demo';

export type ActivityStatus = 'pending' | 'completed' | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';

export type EmailStatus = 'draft' | 'scheduled' | 'sent' | 'failed';

export type NotificationType =
  | 'deal_assigned'
  | 'task_due'
  | 'mention'
  | 'activity_reminder';

export type ReportType = 'sales' | 'activities' | 'pipeline' | 'forecast';

export type IntegrationProvider = 'google' | 'microsoft' | 'slack' | 'zapier';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: UserRole;
  department_id?: string;
  is_active: boolean;
  last_login_at?: Date;
  preferences?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface Company {
  id: string;
  name: string;
  domain?: string;
  logo_url?: string;
  industry?: string;
  size?: CompanySize;
  subscription_tier: SubscriptionTier;
  subscription_expires_at?: Date;
  settings?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface Contact {
  id: string;
  company_id: string;
  owner_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  title?: string;
  department?: string;
  company_name?: string;
  company_website?: string;
  status: ContactStatus;
  lead_source?: LeadSource;
  lead_score: number;
  tags?: string[];
  social_profiles?: Record<string, string>;
  custom_fields?: Record<string, any>;
  last_contact_at?: Date;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface Deal {
  id: string;
  company_id: string;
  contact_id?: string;
  owner_id: string;
  name: string;
  description?: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number;
  expected_close_date?: Date;
  actual_close_date?: Date;
  lost_reason?: string;
  pipeline_id: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface Pipeline {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  stages: PipelineStage[];
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PipelineStage {
  name: string;
  order: number;
  probability: number;
}

export interface Activity {
  id: string;
  company_id: string;
  type: ActivityType;
  subject: string;
  description?: string;
  contact_id?: string;
  deal_id?: string;
  owner_id: string;
  due_date?: Date;
  completed_at?: Date;
  status: ActivityStatus;
  duration?: number;
  outcome?: string;
  attachments?: string[];
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: string;
  company_id: string;
  title: string;
  description?: string;
  assigned_to: string;
  assigned_by: string;
  contact_id?: string;
  deal_id?: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: Date;
  completed_at?: Date;
  tags?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface Email {
  id: string;
  company_id: string;
  from_user_id: string;
  to_emails: string[];
  cc_emails?: string[];
  bcc_emails?: string[];
  subject: string;
  body_html: string;
  body_text?: string;
  contact_id?: string;
  deal_id?: string;
  template_id?: string;
  status: EmailStatus;
  scheduled_at?: Date;
  sent_at?: Date;
  opened_at?: Date;
  clicked_at?: Date;
  attachments?: string[];
  created_at: Date;
  updated_at: Date;
}

export interface EmailTemplate {
  id: string;
  company_id: string;
  name: string;
  subject: string;
  body_html: string;
  variables?: Record<string, any>;
  category?: string;
  is_active: boolean;
  usage_count: number;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface Note {
  id: string;
  company_id: string;
  content: string;
  contact_id?: string;
  deal_id?: string;
  activity_id?: string;
  created_by: string;
  is_pinned: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AuditLog {
  id: string;
  company_id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  changes?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  read_at?: Date;
  created_at: Date;
}

export interface Report {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  type: ReportType;
  config?: Record<string, any>;
  created_by: string;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Integration {
  id: string;
  company_id: string;
  provider: IntegrationProvider;
  credentials?: Record<string, any>;
  settings?: Record<string, any>;
  is_active: boolean;
  last_sync_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard Stats
export interface DashboardStats {
  totalContacts: number;
  totalDeals: number;
  totalRevenue: number;
  dealsWonThisMonth: number;
  pipelineValue: number;
  conversionRate: number;
  activitiesThisWeek: number;
  tasksOverdue: number;
}

// Filter types
export interface ContactFilters {
  status?: ContactStatus;
  lead_source?: LeadSource;
  owner_id?: string;
  tags?: string[];
  search?: string;
}

export interface DealFilters {
  stage?: DealStage;
  owner_id?: string;
  pipeline_id?: string;
  min_value?: number;
  max_value?: number;
  search?: string;
}

export interface ActivityFilters {
  type?: ActivityType;
  status?: ActivityStatus;
  owner_id?: string;
  contact_id?: string;
  deal_id?: string;
  date_from?: Date;
  date_to?: Date;
}

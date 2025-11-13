import User from './User';
import Company from './Company';
import Contact from './Contact';
import Deal from './Deal';
import Pipeline from './Pipeline';
import Activity from './Activity';
import Task from './Task';
import Email from './Email';
import EmailTemplate from './EmailTemplate';
import Note from './Note';
import AuditLog from './AuditLog';
import Notification from './Notification';
import Report from './Report';
import Integration from './Integration';

// Define associations
// Company has many Users
Company.hasMany(User, { foreignKey: 'company_id', as: 'users' });
User.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// Company has many Contacts
Company.hasMany(Contact, { foreignKey: 'company_id', as: 'contacts' });
Contact.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// User has many Contacts (as owner)
User.hasMany(Contact, { foreignKey: 'owner_id', as: 'owned_contacts' });
Contact.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

// User created Contacts
User.hasMany(Contact, { foreignKey: 'created_by', as: 'created_contacts' });
Contact.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Company has many Deals
Company.hasMany(Deal, { foreignKey: 'company_id', as: 'deals' });
Deal.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// Contact has many Deals
Contact.hasMany(Deal, { foreignKey: 'contact_id', as: 'deals' });
Deal.belongsTo(Contact, { foreignKey: 'contact_id', as: 'contact' });

// User has many Deals (as owner)
User.hasMany(Deal, { foreignKey: 'owner_id', as: 'owned_deals' });
Deal.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

// Pipeline has many Deals
Pipeline.hasMany(Deal, { foreignKey: 'pipeline_id', as: 'deals' });
Deal.belongsTo(Pipeline, { foreignKey: 'pipeline_id', as: 'pipeline' });

// Company has many Pipelines
Company.hasMany(Pipeline, { foreignKey: 'company_id', as: 'pipelines' });
Pipeline.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// Company has many Activities
Company.hasMany(Activity, { foreignKey: 'company_id', as: 'activities' });
Activity.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// Contact has many Activities
Contact.hasMany(Activity, { foreignKey: 'contact_id', as: 'activities' });
Activity.belongsTo(Contact, { foreignKey: 'contact_id', as: 'contact' });

// Deal has many Activities
Deal.hasMany(Activity, { foreignKey: 'deal_id', as: 'activities' });
Activity.belongsTo(Deal, { foreignKey: 'deal_id', as: 'deal' });

// User has many Activities (as owner)
User.hasMany(Activity, { foreignKey: 'owner_id', as: 'owned_activities' });
Activity.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

// Company has many Tasks
Company.hasMany(Task, { foreignKey: 'company_id', as: 'tasks' });
Task.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// User has many Tasks (assigned to)
User.hasMany(Task, { foreignKey: 'assigned_to', as: 'assigned_tasks' });
Task.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

// User has many Tasks (assigned by)
User.hasMany(Task, { foreignKey: 'assigned_by', as: 'created_tasks' });
Task.belongsTo(User, { foreignKey: 'assigned_by', as: 'assigner' });

// Contact has many Tasks
Contact.hasMany(Task, { foreignKey: 'contact_id', as: 'tasks' });
Task.belongsTo(Contact, { foreignKey: 'contact_id', as: 'contact' });

// Deal has many Tasks
Deal.hasMany(Task, { foreignKey: 'deal_id', as: 'tasks' });
Task.belongsTo(Deal, { foreignKey: 'deal_id', as: 'deal' });

// Company has many Emails
Company.hasMany(Email, { foreignKey: 'company_id', as: 'emails' });
Email.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// User has many Emails (from)
User.hasMany(Email, { foreignKey: 'from_user_id', as: 'sent_emails' });
Email.belongsTo(User, { foreignKey: 'from_user_id', as: 'sender' });

// Contact has many Emails
Contact.hasMany(Email, { foreignKey: 'contact_id', as: 'emails' });
Email.belongsTo(Contact, { foreignKey: 'contact_id', as: 'contact' });

// Deal has many Emails
Deal.hasMany(Email, { foreignKey: 'deal_id', as: 'emails' });
Email.belongsTo(Deal, { foreignKey: 'deal_id', as: 'deal' });

// EmailTemplate has many Emails
EmailTemplate.hasMany(Email, { foreignKey: 'template_id', as: 'emails' });
Email.belongsTo(EmailTemplate, { foreignKey: 'template_id', as: 'template' });

// Company has many EmailTemplates
Company.hasMany(EmailTemplate, { foreignKey: 'company_id', as: 'email_templates' });
EmailTemplate.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// Company has many Notes
Company.hasMany(Note, { foreignKey: 'company_id', as: 'notes' });
Note.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// Contact has many Notes
Contact.hasMany(Note, { foreignKey: 'contact_id', as: 'notes' });
Note.belongsTo(Contact, { foreignKey: 'contact_id', as: 'contact' });

// Deal has many Notes
Deal.hasMany(Note, { foreignKey: 'deal_id', as: 'notes' });
Note.belongsTo(Deal, { foreignKey: 'deal_id', as: 'deal' });

// Activity has many Notes
Activity.hasMany(Note, { foreignKey: 'activity_id', as: 'notes' });
Note.belongsTo(Activity, { foreignKey: 'activity_id', as: 'activity' });

// User created Notes
User.hasMany(Note, { foreignKey: 'created_by', as: 'notes' });
Note.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Company has many AuditLogs
Company.hasMany(AuditLog, { foreignKey: 'company_id', as: 'audit_logs' });
AuditLog.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// User has many AuditLogs
User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'audit_logs' });
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User has many Notifications
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Company has many Reports
Company.hasMany(Report, { foreignKey: 'company_id', as: 'reports' });
Report.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// User created Reports
User.hasMany(Report, { foreignKey: 'created_by', as: 'reports' });
Report.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Company has many Integrations
Company.hasMany(Integration, { foreignKey: 'company_id', as: 'integrations' });
Integration.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

export {
  User,
  Company,
  Contact,
  Deal,
  Pipeline,
  Activity,
  Task,
  Email,
  EmailTemplate,
  Note,
  AuditLog,
  Notification,
  Report,
  Integration,
};

export default {
  User,
  Company,
  Contact,
  Deal,
  Pipeline,
  Activity,
  Task,
  Email,
  EmailTemplate,
  Note,
  AuditLog,
  Notification,
  Report,
  Integration,
};

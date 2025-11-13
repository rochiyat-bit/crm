import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/config';
import { EmailStatus } from '@/types';

interface EmailAttributes {
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
  created_at?: Date;
  updated_at?: Date;
}

interface EmailCreationAttributes extends Optional<EmailAttributes, 'id' | 'status'> {}

class Email extends Model<EmailAttributes, EmailCreationAttributes> implements EmailAttributes {
  declare id: string;
  declare company_id: string;
  declare from_user_id: string;
  declare to_emails: string[];
  declare cc_emails?: string[];
  declare bcc_emails?: string[];
  declare subject: string;
  declare body_html: string;
  declare body_text?: string;
  declare contact_id?: string;
  declare deal_id?: string;
  declare template_id?: string;
  declare status: EmailStatus;
  declare scheduled_at?: Date;
  declare sent_at?: Date;
  declare opened_at?: Date;
  declare clicked_at?: Date;
  declare attachments?: string[];
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Email.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    company_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    from_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    to_emails: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    cc_emails: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    bcc_emails: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body_html: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    body_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contact_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    deal_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    template_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'scheduled', 'sent', 'failed'),
      allowNull: false,
      defaultValue: 'draft',
    },
    scheduled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    opened_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    clicked_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    attachments: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'emails',
    modelName: 'Email',
    indexes: [
      {
        fields: ['company_id'],
      },
      {
        fields: ['from_user_id'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

export default Email;

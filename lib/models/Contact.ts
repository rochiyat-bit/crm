import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/config';
import { ContactStatus, LeadSource } from '@/types';

interface ContactAttributes {
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
  created_at?: Date;
  updated_at?: Date;
}

interface ContactCreationAttributes
  extends Optional<ContactAttributes, 'id' | 'status' | 'lead_score'> {}

class Contact
  extends Model<ContactAttributes, ContactCreationAttributes>
  implements ContactAttributes
{
  declare id: string;
  declare company_id: string;
  declare owner_id: string;
  declare first_name: string;
  declare last_name: string;
  declare email?: string;
  declare phone?: string;
  declare title?: string;
  declare department?: string;
  declare company_name?: string;
  declare company_website?: string;
  declare status: ContactStatus;
  declare lead_source?: LeadSource;
  declare lead_score: number;
  declare tags?: string[];
  declare social_profiles?: Record<string, string>;
  declare custom_fields?: Record<string, any>;
  declare last_contact_at?: Date;
  declare created_by: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Contact.init(
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
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('lead', 'prospect', 'customer', 'inactive'),
      allowNull: false,
      defaultValue: 'lead',
    },
    lead_source: {
      type: DataTypes.ENUM('website', 'referral', 'cold_call', 'marketing', 'partner'),
      allowNull: true,
    },
    lead_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    tags: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    social_profiles: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    custom_fields: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    last_contact_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'contacts',
    modelName: 'Contact',
    indexes: [
      {
        fields: ['company_id', 'owner_id'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['email'],
      },
      {
        fields: ['last_contact_at'],
      },
    ],
  }
);

export default Contact;

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/config';

interface EmailTemplateAttributes {
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
  created_at?: Date;
  updated_at?: Date;
}

interface EmailTemplateCreationAttributes
  extends Optional<EmailTemplateAttributes, 'id' | 'is_active' | 'usage_count'> {}

class EmailTemplate
  extends Model<EmailTemplateAttributes, EmailTemplateCreationAttributes>
  implements EmailTemplateAttributes
{
  declare id: string;
  declare company_id: string;
  declare name: string;
  declare subject: string;
  declare body_html: string;
  declare variables?: Record<string, any>;
  declare category?: string;
  declare is_active: boolean;
  declare usage_count: number;
  declare created_by: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

EmailTemplate.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body_html: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    variables: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    usage_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'email_templates',
    modelName: 'EmailTemplate',
    indexes: [
      {
        fields: ['company_id'],
      },
    ],
  }
);

export default EmailTemplate;

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/config';
import { ActivityType, ActivityStatus } from '@/types';

interface ActivityAttributes {
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
  created_at?: Date;
  updated_at?: Date;
}

interface ActivityCreationAttributes extends Optional<ActivityAttributes, 'id' | 'status'> {}

class Activity
  extends Model<ActivityAttributes, ActivityCreationAttributes>
  implements ActivityAttributes
{
  declare id: string;
  declare company_id: string;
  declare type: ActivityType;
  declare subject: string;
  declare description?: string;
  declare contact_id?: string;
  declare deal_id?: string;
  declare owner_id: string;
  declare due_date?: Date;
  declare completed_at?: Date;
  declare status: ActivityStatus;
  declare duration?: number;
  declare outcome?: string;
  declare attachments?: string[];
  declare created_by: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Activity.init(
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
    type: {
      type: DataTypes.ENUM('call', 'email', 'meeting', 'task', 'note', 'demo'),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
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
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    outcome: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    attachments: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'activities',
    modelName: 'Activity',
    indexes: [
      {
        fields: ['company_id', 'owner_id'],
      },
      {
        fields: ['due_date'],
      },
      {
        fields: ['contact_id'],
      },
    ],
  }
);

export default Activity;

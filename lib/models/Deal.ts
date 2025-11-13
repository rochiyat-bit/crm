import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/config';
import { DealStage } from '@/types';

interface DealAttributes {
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
  created_at?: Date;
  updated_at?: Date;
}

interface DealCreationAttributes
  extends Optional<
    DealAttributes,
    'id' | 'currency' | 'stage' | 'probability' | 'pipeline_id'
  > {}

class Deal extends Model<DealAttributes, DealCreationAttributes> implements DealAttributes {
  declare id: string;
  declare company_id: string;
  declare contact_id?: string;
  declare owner_id: string;
  declare name: string;
  declare description?: string;
  declare value: number;
  declare currency: string;
  declare stage: DealStage;
  declare probability: number;
  declare expected_close_date?: Date;
  declare actual_close_date?: Date;
  declare lost_reason?: string;
  declare pipeline_id: string;
  declare tags?: string[];
  declare custom_fields?: Record<string, any>;
  declare created_by: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Deal.init(
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
    contact_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
    },
    stage: {
      type: DataTypes.ENUM(
        'prospecting',
        'qualification',
        'proposal',
        'negotiation',
        'closed_won',
        'closed_lost'
      ),
      allowNull: false,
      defaultValue: 'prospecting',
    },
    probability: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: {
        min: 0,
        max: 100,
      },
    },
    expected_close_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actual_close_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lost_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pipeline_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tags: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    custom_fields: {
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
    tableName: 'deals',
    modelName: 'Deal',
    indexes: [
      {
        fields: ['company_id', 'stage'],
      },
      {
        fields: ['owner_id'],
      },
      {
        fields: ['expected_close_date'],
      },
      {
        fields: ['value'],
      },
    ],
  }
);

export default Deal;

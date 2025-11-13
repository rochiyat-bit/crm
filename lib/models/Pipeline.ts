import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/config';
import { PipelineStage } from '@/types';

interface PipelineAttributes {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  stages: PipelineStage[];
  is_default: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface PipelineCreationAttributes extends Optional<PipelineAttributes, 'id' | 'is_default'> {}

class Pipeline
  extends Model<PipelineAttributes, PipelineCreationAttributes>
  implements PipelineAttributes
{
  declare id: string;
  declare company_id: string;
  declare name: string;
  declare description?: string;
  declare stages: PipelineStage[];
  declare is_default: boolean;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Pipeline.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    stages: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [
        { name: 'Prospecting', order: 1, probability: 10 },
        { name: 'Qualification', order: 2, probability: 25 },
        { name: 'Proposal', order: 3, probability: 50 },
        { name: 'Negotiation', order: 4, probability: 75 },
        { name: 'Closed Won', order: 5, probability: 100 },
        { name: 'Closed Lost', order: 6, probability: 0 },
      ],
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'pipelines',
    modelName: 'Pipeline',
    indexes: [
      {
        fields: ['company_id'],
      },
    ],
  }
);

export default Pipeline;

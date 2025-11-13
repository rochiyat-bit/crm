import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/config';
import { ReportType } from '@/types';

interface ReportAttributes {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  type: ReportType;
  config?: Record<string, any>;
  created_by: string;
  is_public: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface ReportCreationAttributes extends Optional<ReportAttributes, 'id' | 'is_public'> {}

class Report extends Model<ReportAttributes, ReportCreationAttributes> implements ReportAttributes {
  declare id: string;
  declare company_id: string;
  declare name: string;
  declare description?: string;
  declare type: ReportType;
  declare config?: Record<string, any>;
  declare created_by: string;
  declare is_public: boolean;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Report.init(
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
    type: {
      type: DataTypes.ENUM('sales', 'activities', 'pipeline', 'forecast'),
      allowNull: false,
    },
    config: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'reports',
    modelName: 'Report',
    indexes: [
      {
        fields: ['company_id'],
      },
    ],
  }
);

export default Report;

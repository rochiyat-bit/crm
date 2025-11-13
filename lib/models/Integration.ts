import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/config';
import { IntegrationProvider } from '@/types';

interface IntegrationAttributes {
  id: string;
  company_id: string;
  provider: IntegrationProvider;
  credentials?: Record<string, any>;
  settings?: Record<string, any>;
  is_active: boolean;
  last_sync_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

interface IntegrationCreationAttributes extends Optional<IntegrationAttributes, 'id' | 'is_active'> {}

class Integration
  extends Model<IntegrationAttributes, IntegrationCreationAttributes>
  implements IntegrationAttributes
{
  declare id: string;
  declare company_id: string;
  declare provider: IntegrationProvider;
  declare credentials?: Record<string, any>;
  declare settings?: Record<string, any>;
  declare is_active: boolean;
  declare last_sync_at?: Date;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Integration.init(
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
    provider: {
      type: DataTypes.ENUM('google', 'microsoft', 'slack', 'zapier'),
      allowNull: false,
    },
    credentials: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    settings: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    last_sync_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'integrations',
    modelName: 'Integration',
    indexes: [
      {
        fields: ['company_id'],
      },
    ],
  }
);

export default Integration;

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/config';

interface AuditLogAttributes {
  id: string;
  company_id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  changes?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at?: Date;
}

interface AuditLogCreationAttributes extends Optional<AuditLogAttributes, 'id'> {}

class AuditLog
  extends Model<AuditLogAttributes, AuditLogCreationAttributes>
  implements AuditLogAttributes
{
  declare id: string;
  declare company_id: string;
  declare user_id: string;
  declare action: string;
  declare entity_type: string;
  declare entity_id: string;
  declare changes?: Record<string, any>;
  declare ip_address?: string;
  declare user_agent?: string;
  declare readonly created_at: Date;
}

AuditLog.init(
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
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entity_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entity_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    changes: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'audit_logs',
    modelName: 'AuditLog',
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        fields: ['company_id', 'created_at'],
      },
    ],
  }
);

export default AuditLog;

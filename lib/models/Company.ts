import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/config';
import { CompanySize, SubscriptionTier } from '@/types';

interface CompanyAttributes {
  id: string;
  name: string;
  domain?: string;
  logo_url?: string;
  industry?: string;
  size?: CompanySize;
  subscription_tier: SubscriptionTier;
  subscription_expires_at?: Date;
  settings?: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
}

interface CompanyCreationAttributes
  extends Optional<CompanyAttributes, 'id' | 'subscription_tier'> {}

class Company
  extends Model<CompanyAttributes, CompanyCreationAttributes>
  implements CompanyAttributes
{
  declare id: string;
  declare name: string;
  declare domain?: string;
  declare logo_url?: string;
  declare industry?: string;
  declare size?: CompanySize;
  declare subscription_tier: SubscriptionTier;
  declare subscription_expires_at?: Date;
  declare settings?: Record<string, any>;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Company.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logo_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size: {
      type: DataTypes.ENUM('small', 'medium', 'large', 'enterprise'),
      allowNull: true,
    },
    subscription_tier: {
      type: DataTypes.ENUM('free', 'pro', 'enterprise'),
      allowNull: false,
      defaultValue: 'free',
    },
    subscription_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    settings: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'companies',
    modelName: 'Company',
  }
);

export default Company;

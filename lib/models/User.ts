import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/config';
import { UserRole } from '@/types';

interface UserAttributes {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  avatar_url?: string;
  role: UserRole;
  company_id: string;
  department_id?: string;
  is_active: boolean;
  last_login_at?: Date;
  preferences?: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'is_active'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare email: string;
  declare password_hash: string;
  declare name: string;
  declare avatar_url?: string;
  declare role: UserRole;
  declare company_id: string;
  declare department_id?: string;
  declare is_active: boolean;
  declare last_login_at?: Date;
  declare preferences?: Record<string, any>;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('super_admin', 'admin', 'manager', 'sales', 'support'),
      allowNull: false,
      defaultValue: 'sales',
    },
    company_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    department_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    preferences: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    indexes: [
      {
        fields: ['email'],
        unique: true,
      },
      {
        fields: ['company_id'],
      },
      {
        fields: ['role'],
      },
    ],
  }
);

export default User;

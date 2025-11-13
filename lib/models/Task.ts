import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/config';
import { TaskPriority, TaskStatus } from '@/types';

interface TaskAttributes {
  id: string;
  company_id: string;
  title: string;
  description?: string;
  assigned_to: string;
  assigned_by: string;
  contact_id?: string;
  deal_id?: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: Date;
  completed_at?: Date;
  tags?: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
}

interface TaskCreationAttributes
  extends Optional<TaskAttributes, 'id' | 'priority' | 'status'> {}

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  declare id: string;
  declare company_id: string;
  declare title: string;
  declare description?: string;
  declare assigned_to: string;
  declare assigned_by: string;
  declare contact_id?: string;
  declare deal_id?: string;
  declare priority: TaskPriority;
  declare status: TaskStatus;
  declare due_date?: Date;
  declare completed_at?: Date;
  declare tags?: Record<string, any>;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Task.init(
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    assigned_to: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    assigned_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    contact_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    deal_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium',
    },
    status: {
      type: DataTypes.ENUM('todo', 'in_progress', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'todo',
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'tasks',
    modelName: 'Task',
    indexes: [
      {
        fields: ['company_id'],
      },
      {
        fields: ['assigned_to'],
      },
      {
        fields: ['due_date'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

export default Task;

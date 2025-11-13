import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/config';
import { NotificationType } from '@/types';

interface NotificationAttributes {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  read_at?: Date;
  created_at?: Date;
}

interface NotificationCreationAttributes
  extends Optional<NotificationAttributes, 'id' | 'is_read'> {}

class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  declare id: string;
  declare user_id: string;
  declare type: NotificationType;
  declare title: string;
  declare message: string;
  declare link?: string;
  declare is_read: boolean;
  declare read_at?: Date;
  declare readonly created_at: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('deal_assigned', 'task_due', 'mention', 'activity_reminder'),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'notifications',
    modelName: 'Notification',
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        fields: ['user_id', 'is_read'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
);

export default Notification;

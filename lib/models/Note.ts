import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/config';

interface NoteAttributes {
  id: string;
  company_id: string;
  content: string;
  contact_id?: string;
  deal_id?: string;
  activity_id?: string;
  created_by: string;
  is_pinned: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface NoteCreationAttributes extends Optional<NoteAttributes, 'id' | 'is_pinned'> {}

class Note extends Model<NoteAttributes, NoteCreationAttributes> implements NoteAttributes {
  declare id: string;
  declare company_id: string;
  declare content: string;
  declare contact_id?: string;
  declare deal_id?: string;
  declare activity_id?: string;
  declare created_by: string;
  declare is_pinned: boolean;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

Note.init(
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
    content: {
      type: DataTypes.TEXT,
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
    activity_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    is_pinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'notes',
    modelName: 'Note',
    indexes: [
      {
        fields: ['company_id'],
      },
      {
        fields: ['contact_id'],
      },
      {
        fields: ['deal_id'],
      },
    ],
  }
);

export default Note;

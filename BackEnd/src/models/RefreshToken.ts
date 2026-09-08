import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

// RefreshToken attributes interface
export interface IRefreshTokenAttributes {
  id: number;
  token: string;
  userId: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Attributes for creation
type IRefreshTokenCreationAttributes = Optional<
  IRefreshTokenAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

// RefreshToken model class
class RefreshToken
  extends Model<IRefreshTokenAttributes, IRefreshTokenCreationAttributes>
  implements IRefreshTokenAttributes
{
  declare id: number;
  declare token: string;
  declare userId: number;
  declare expiresAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Check if token is expired
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}

// Initialize the RefreshToken model
RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'refresh_tokens',
    timestamps: true,
    indexes: [
      {
        fields: ['token'],
      },
      {
        fields: ['userId'],
      },
    ],
  }
);

// Set up association
User.hasMany(RefreshToken, { foreignKey: 'userId', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

export default RefreshToken;

import bcrypt from 'bcryptjs';
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.js';

// User attributes interface
export interface IUserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Attributes for creation (id is auto-generated)
type IUserCreationAttributes = Optional<IUserAttributes, 'id' | 'createdAt' | 'updatedAt'>;

// User model class
class User
  extends Model<IUserAttributes, IUserCreationAttributes>
  implements IUserAttributes
{
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Instance method to compare password
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

// Initialize the User model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name is required' },
        len: {
          args: [2, 50],
          msg: 'Name must be between 2 and 50 characters',
        },
      },
      set(value: string) {
        this.setDataValue('name', value.trim());
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Email is required' },
        isEmail: { msg: 'Please enter a valid email' },
      },
      set(value: string) {
        this.setDataValue('email', value.toLowerCase().trim());
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password is required' },
        len: {
          args: [6, 255],
          msg: 'Password must be at least 6 characters',
        },
      },
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
    tableName: 'users',
    timestamps: true,
    // Default scope excludes password
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    // Scope to include password when needed
    scopes: {
      withPassword: {
        attributes: { include: ['password'] },
      },
    },
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
    ],
  }
);

// Hash password before saving
User.beforeSave(async (user) => {
  // Only hash if password is new or modified
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

export default User;

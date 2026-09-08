import { DATABASE_URL, IS_DEVELOPMENT } from '@/constants/env.js';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: IS_DEVELOPMENT ? console.log : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Neon uses self-signed certs
    },
  },
  pool: {
    max: IS_DEVELOPMENT ? 5 : 2, // Neon pooler has connection limits
    min: 0,
    acquire: 30000,
    idle: 5000, // Release idle connections faster (important for serverless)
  },
});

const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected successfully');

    // Only sync in development — never alter tables in production
    if (IS_DEVELOPMENT) {
      await sequelize.sync({ alter: true });
      console.log('Database synced');
    }
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
};

export { sequelize };
export default connectDB;

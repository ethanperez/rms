import { Client } from 'pg';

export const getClient = () => new Client({
  user: process.env.RDS_DB_USER,
  host: process.env.RDS_DB_HOST,
  database: process.env.RDS_DB_DATABASE,
  password: process.env.RDS_DB_PASSWORD,
  port: parseInt(process.env.RDS_DB_PORT as string, 10),
});

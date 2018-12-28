import { Client } from 'pg';

export const getClient = () => new Client({
  user: process.env.LEGACY_DB_USER,
  host: process.env.LEGACY_DB_HOST,
  database: process.env.LEGACY_DB_DATABASE,
  password: process.env.LEGACY_DB_PASSWORD,
  port: parseInt(process.env.LEGACY_DB_PORT as string, 10),
});

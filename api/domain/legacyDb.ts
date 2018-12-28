import { isNil } from 'ramda';
import { Pool } from 'pg';

let _legacyPool: Pool;

export const instantiatePool = () => {
  if (!isNil(_legacyPool)) throw new Error('Pool is already instantiated');

  _legacyPool = new Pool({
    user: process.env.LEGACY_DB_USER,
    host: process.env.LEGACY_DB_HOST,
    database: process.env.LEGACY_DB_DATABASE,
    password: process.env.LEGACY_DB_PASSWORD,
    port: parseInt(process.env.LEGACY_DB_PORT as string, 10),
  });

  return _legacyPool;
};

export const getPoolInstance = () => _legacyPool;

import { isNil } from 'ramda';
import { Pool } from 'pg';

let _rdsPool: Pool;

export const instantiatePool = () => {
  if (!isNil(_rdsPool)) throw new Error('Pool is already instantiated');

  _rdsPool = new Pool({
    user: process.env.RDS_DB_USER,
    host: process.env.RDS_DB_HOST,
    database: process.env.RDS_DB_DATABASE,
    password: process.env.RDS_DB_PASSWORD,
    port: parseInt(process.env.RDS_DB_PORT as string, 10),
  });

  return _rdsPool;
};

export const getPoolInstance = () => _rdsPool;

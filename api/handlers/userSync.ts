import * as pqformat from 'pg-format';
import { instantiateLegacyPool, instantiateRdsPool } from '../domain';

export const sync = async () => {
  const legacyPool = instantiateLegacyPool();
  const rdsPool = instantiateRdsPool();

  const rdsInsertQuery = `
    INSERT INTO public.user (email, password, first_name, last_name)
    VALUES %L
    ON CONFLICT (email) DO UPDATE
      SET password = excluded.password,
          first_name = excluded.first_name,
          last_name = excluded.last_name,
          last_updated = NOW();
  `;

  const legacySelectQuery = `
    SELECT id, password, email, first_name, last_name FROM team_member
  `;

  try {  
    const query: QueryResponse = await legacyPool.query(legacySelectQuery);
    const userInsertArray = query.rows.map(user => {
      return [user.email, user.password, user.first_name, user.last_name]
    });

    await rdsPool.query(pqformat(rdsInsertQuery, userInsertArray));
  } catch (e) {
    // Do nothing
    console.log(e);
    
  } finally {
    await legacyPool.end()
    await rdsPool.end();
  }

  return { statusCode: 200 };
};

type QueryResponse = {
  rows: LegacyUser[];
  length?: number;
};

type LegacyUser = {
  id: number;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
};

type RdsUser = {
  password: string;
  email: string;
  first_name: string;
  last_name: string;
};

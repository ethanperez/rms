import * as pqformat from 'pg-format';
import { getLegacyClient, getRdsClient } from '../domain';

export const sync = async () => {
  const legacyPool = getLegacyClient();
  const rdsPool = getRdsClient();

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
    // Open client connections
    await legacyPool.connect();
    await rdsPool.connect();
  } catch (e) {
    // TODO: log
    console.log(e);
  }

  try {  
    const query: LegacyQueryResponse = await legacyPool.query(legacySelectQuery);
    const userInsertArray = query.rows.map(user => {
      return [user.email, user.password, user.first_name, user.last_name]
    });

    await rdsPool.query(pqformat(rdsInsertQuery, userInsertArray));
  } catch (e) {
    // TODO: log
    console.log(e);
  }

  // End client connections
  await legacyPool.end()
  await rdsPool.end();

  return { statusCode: 200 };
};

type LegacyQueryResponse = {
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

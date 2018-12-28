import { Pool } from 'pg';

export const sync = async () => {
  const pool = new Pool({
    user: process.env.LEGACY_DB_USER,
    host: process.env.LEGACY_DB_HOST,
    database: process.env.LEGACY_DB_DATABASE,
    password: process.env.LEGACY_DB_PASSWORD,
    port: parseInt(process.env.LEGACY_DB_PORT as string, 10),
  });

  const rdsPool = new Pool({
    user: process.env.RDS_DB_USER,
    host: process.env.RDS_DB_HOST,
    database: process.env.RDS_DB_DATABASE,
    password: process.env.RDS_DB_PASSWORD,
    port: parseInt(process.env.RDS_DB_PORT as string, 10),
  });
  console.log(process.env);
  try {  
    const query: Fun = await pool.query('SELECT id, password, email, first_name, last_name FROM team_member');
  
    const text = `
      INSERT INTO public.user (email, password, first_name, last_name) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE
        SET password = excluded.password,
            first_name = excluded.first_name,
            last_name = excluded.last_name;
    `;
    for (let d of query.rows) {
      const i = toNew(d);
      const values = [i.email, i.password, i.first_name, i.last_name];
  
      await rdsPool.query(text, values);
    }
  } catch (e) {
    // Do nothing
    console.log(e);
    
  } finally {
    await pool.end()
    await rdsPool.end();
  }

  return {
    statusCode: 200,
    body: 'test',
  }
};

const toNew = (old: Old): New => ({
  password: old.password,
  email: old.email,
  first_name: old.first_name,
  last_name: old.last_name,
});

type Fun = {
  rows: Old[];
  length?: number;
};

type Old = {
  id: number;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
};

type New = {
  password: string;
  email: string;
  first_name: string;
  last_name: string;
};

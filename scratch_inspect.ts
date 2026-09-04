import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_dXRQIqt8B1ST@ep-muddy-math-azkf4lor-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const res = await pool.query('SELECT id, name, email, role, "emailVerified" FROM "user"');
    console.log('Registered Users in DB:');
    console.log(JSON.stringify(res.rows, null, 2));

    const events = await pool.query('SELECT id, title, "ownerId" FROM "Event"');
    console.log('Events in DB:');
    console.log(JSON.stringify(events.rows, null, 2));
  } catch (err) {
    console.error('Error querying DB:', err);
  } finally {
    await pool.end();
  }
}

main();

import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: 'monmotdepasse',
  port: 5432,
  database: 'ma_base_auto' // on utilise la base qu’on vient de créer
});

async function initTables() {
  try {
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE
      )
    `);

    console.log("✅ Table users créée !");
  } catch (err) {
    console.error("❌ Erreur : ", err.message);
  } finally {
    await client.end();
  }
}

initTables();

// Script d'initialisation de la base de données
// Usage : node setup-db.js
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setup() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('✅ Base de données initialisée avec succès');
  } catch (e) {
    console.error('❌ Erreur :', e.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}
setup();

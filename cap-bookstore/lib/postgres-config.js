/**
 * Centralized PostgreSQL configuration
 * Reusable across server.js, init-db.js and other modules
 */

function getPostgresConfig() {
  return {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    database: process.env.POSTGRES_DB || 'capdb',
    user: process.env.POSTGRES_USER || 'capuser',
    password: process.env.POSTGRES_PASSWORD || '',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };
}

module.exports = { getPostgresConfig };
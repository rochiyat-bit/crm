/**
 * Database Migration Script
 * Synchronizes all Sequelize models with the PostgreSQL database
 */

const { syncDatabase, testConnection } = require('../lib/db/config');

async function main() {
  console.log('🚀 Starting database migration...\n');

  // Test database connection
  const isConnected = await testConnection();
  if (!isConnected) {
    console.error('❌ Database connection failed. Please check your DATABASE_URL.');
    process.exit(1);
  }

  // Sync database
  const isSynced = await syncDatabase(false);
  if (!isSynced) {
    console.error('❌ Database synchronization failed.');
    process.exit(1);
  }

  console.log('\n✅ Database migration completed successfully!');
  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});

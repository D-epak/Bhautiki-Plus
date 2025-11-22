import 'dotenv/config'; 
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgreDb ,{client} from './db';
import logger from './logger';
async function migrateData() {
  try {
    await migrate(postgreDb, { migrationsFolder: `./drizzle` });
    logger.info("Migrations completed successfully.");
  } catch (error) {
    logger.error("Migration failed:", error);
  } finally {
    await client.end();
    logger.info("Database connection closed.");
  }
}

migrateData().catch((err) => {
  logger.error("Unexpected error:", err);
  process.exit(1); // Exit with a failure status
});

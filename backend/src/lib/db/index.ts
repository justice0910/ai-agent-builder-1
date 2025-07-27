import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.ts';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create the connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create postgres client
const client = postgres(connectionString);

// Create drizzle instance
export const db = drizzle(client, { schema });

// Export the client for manual operations if needed
export { client as postgresClient };

// Export schema for migrations
export * from './schema.ts'; 
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { readFileSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Database connection interface
export interface DatabaseConnection {
  db: Database<sqlite3.Database, sqlite3.Statement>;
  close: () => Promise<void>;
}

// Database configuration
const DB_PATH = process.env.DATABASE_PATH || join(process.cwd(), 'server/database/tarhal.db');
const SCHEMA_PATH = join(process.cwd(), 'server/database/schema.sql');

// Global database instance
let dbInstance: Database<sqlite3.Database, sqlite3.Statement> | null = null;

const ADMIN_DATA_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS admin_data (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

/**
 * Initialize the database connection and create tables
 * إذا فشل تحميل schema.sql (مثلاً في نشر بدون مصدر) ننشئ جدول admin_data فقط
 */
export async function initializeDatabase(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
  try {
    console.log('🗄️  Initializing database...');

    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    await db.exec('PRAGMA foreign_keys = ON');
    await db.exec('PRAGMA journal_mode = WAL');
    await db.exec('PRAGMA synchronous = NORMAL');
    await db.exec('PRAGMA cache_size = 1000');
    await db.exec('PRAGMA temp_store = MEMORY');

    try {
      const schema = readFileSync(SCHEMA_PATH, 'utf-8');
      await db.exec(schema);
    } catch (schemaError: any) {
      if (schemaError?.code === 'ENOENT' || !schemaError) {
        console.warn('⚠️  Schema file not found, creating admin_data table only');
        await db.exec(ADMIN_DATA_TABLE_SQL);
      } else {
        throw schemaError;
      }
    }

    // التأكد من وجود جدول admin_data (للتوافق مع schema قديم)
    await db.exec(ADMIN_DATA_TABLE_SQL);

    console.log('✅ Database initialized successfully');
    dbInstance = db;
    return db;
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Get the database instance
 */
export async function getDatabase(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
  if (!dbInstance) {
    dbInstance = await initializeDatabase();
  }
  return dbInstance;
}

/**
 * Close the database connection
 */
export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
    console.log('🔒 Database connection closed');
  }
}

/**
 * Generate a unique ID for database records
 */
export function generateId(prefix: string = ''): string {
  const id = uuidv4();
  return prefix ? `${prefix}_${id}` : id;
}

/**
 * Execute a transaction with automatic rollback on error
 */
export async function executeTransaction<T>(
  operations: (db: Database<sqlite3.Database, sqlite3.Statement>) => Promise<T>
): Promise<T> {
  const db = await getDatabase();
  
  try {
    await db.exec('BEGIN TRANSACTION');
    const result = await operations(db);
    await db.exec('COMMIT');
    return result;
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }
}

/**
 * Log database operations for audit trail
 */
export async function logAuditAction(
  userId: string | null,
  action: string,
  tableName: string,
  recordId: string | null,
  oldValues: any = null,
  newValues: any = null,
  ipAddress: string | null = null,
  userAgent: string | null = null
): Promise<void> {
  const db = await getDatabase();
  
  try {
    await db.run(
      `INSERT INTO audit_log (
        id, user_id, action, table_name, record_id, 
        old_values, new_values, ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        generateId('audit'),
        userId,
        action,
        tableName,
        recordId,
        oldValues ? JSON.stringify(oldValues) : null,
        newValues ? JSON.stringify(newValues) : null,
        ipAddress,
        userAgent
      ]
    );
  } catch (error) {
    console.error('Failed to log audit action:', error);
    // Don't throw error as audit logging should not break main operations
  }
}

/**
 * Validate JSON field before saving to database
 */
export function validateAndStringifyJSON(data: any): string | null {
  if (data === null || data === undefined) {
    return null;
  }
  
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Failed to stringify JSON data:', error);
    return null;
  }
}

/**
 * Parse JSON field from database
 */
export function parseJSONField<T>(jsonString: string | null, defaultValue: T): T {
  if (!jsonString) {
    return defaultValue;
  }
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Failed to parse JSON field:', error);
    return defaultValue;
  }
}

/**
 * Database health check
 */
export async function checkDatabaseHealth(): Promise<{
  connected: boolean;
  tablesExist: boolean;
  recordCounts: Record<string, number>;
}> {
  try {
    const db = await getDatabase();
    
    // Check connection
    await db.get('SELECT 1');
    
    // Check if main tables exist
    const tables = await db.all(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `);
    
    const expectedTables = [
      'countries', 'cities', 'travel_offices', 'users', 
      'tours', 'bookings', 'reviews', 'contact_messages',
      'newsletter_subscriptions', 'system_settings', 'audit_log'
    ];
    
    const existingTableNames = tables.map(t => t.name);
    const tablesExist = expectedTables.every(table => existingTableNames.includes(table));
    
    // Get record counts
    const recordCounts: Record<string, number> = {};
    for (const table of expectedTables) {
      if (existingTableNames.includes(table)) {
        const result = await db.get(`SELECT COUNT(*) as count FROM ${table}`);
        recordCounts[table] = result.count;
      }
    }
    
    return {
      connected: true,
      tablesExist,
      recordCounts
    };
  } catch (error) {
    console.error('Database health check failed:', error);
    return {
      connected: false,
      tablesExist: false,
      recordCounts: {}
    };
  }
}

/**
 * Backup database to a file
 */
export async function backupDatabase(backupPath?: string): Promise<string> {
  const db = await getDatabase();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const finalBackupPath = backupPath || join(process.cwd(), `backup_${timestamp}.db`);
  
  try {
    await db.exec(`VACUUM INTO '${finalBackupPath}'`);
    console.log(`✅ Database backed up to: ${finalBackupPath}`);
    return finalBackupPath;
  } catch (error) {
    console.error('❌ Database backup failed:', error);
    throw error;
  }
}

/**
 * Clean up old audit logs (keep last 30 days)
 */
export async function cleanupAuditLogs(daysToKeep: number = 30): Promise<number> {
  const db = await getDatabase();
  
  try {
    const result = await db.run(
      `DELETE FROM audit_log 
       WHERE created_at < datetime('now', '-${daysToKeep} days')`
    );
    
    const deletedCount = result.changes || 0;
    console.log(`🧹 Cleaned up ${deletedCount} old audit log entries`);
    return deletedCount;
  } catch (error) {
    console.error('Failed to cleanup audit logs:', error);
    throw error;
  }
}

// Export database connection for direct access if needed
export { dbInstance };

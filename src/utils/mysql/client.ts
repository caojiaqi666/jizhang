import { getPool } from './connection'
import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise'

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function withRetry<T>(operation: () => Promise<T>): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      // Only retry on connection-related errors or typical temporary failures
      // ETIMEDOUT: Connection timed out
      // ECONNRESET: Connection reset by peer
      // PROTOCOL_CONNECTION_LOST: Connection lost
      // ER_LOCK_DEADLOCK: Deadlock found when trying to get lock
      if (
        error.code === 'ETIMEDOUT' || 
        error.code === 'ECONNRESET' || 
        error.code === 'PROTOCOL_CONNECTION_LOST' ||
        error.code === 'ER_LOCK_DEADLOCK'
      ) {
        console.warn(`Database operation failed (attempt ${i + 1}/${MAX_RETRIES}): ${error.message}. Retrying...`);
        if (i < MAX_RETRIES - 1) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          continue;
        }
      }
      throw error;
    }
  }
  throw lastError;
}

export async function query<T extends RowDataPacket>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  return withRetry(async () => {
    const pool = getPool()
    const [rows] = await pool.execute<T[]>(sql, params)
    return rows
  })
}

export async function queryOne<T extends RowDataPacket>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows.length > 0 ? rows[0] : null
}

export async function execute(
  sql: string,
  params?: any[]
): Promise<ResultSetHeader> {
  return withRetry(async () => {
    const pool = getPool()
    const [result] = await pool.execute<ResultSetHeader>(sql, params)
    return result
  })
}

export async function transaction<T>(
  callback: (connection: any) => Promise<T>
): Promise<T> {
  const pool = getPool()
  const connection = await pool.getConnection()
  
  try {
    await connection.beginTransaction()
    const result = await callback(connection)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

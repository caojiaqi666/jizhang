import mysql from 'mysql2/promise'

declare global {
  var mysqlPool: mysql.Pool | undefined
}

export function getPool(): mysql.Pool {
  if (global.mysqlPool) return global.mysqlPool

  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'jizhang',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    timezone: '+00:00', // Use UTC
    connectTimeout: 20000, // Increase timeout to 20s
  })

  if (process.env.NODE_ENV !== 'production') {
    global.mysqlPool = pool
  }

  return pool
}

export async function closePool() {
  if (global.mysqlPool) {
    await global.mysqlPool.end()
    global.mysqlPool = undefined
  }
}


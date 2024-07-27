import { Client } from 'pg';
import { Connection, createConnection } from 'mysql2/promise';
import ApiError from './ApiError';
import httpStatus from 'http-status';

export async function getPostgresEncoding(config: any) {
  const { host, port, db, pass, user } = config;
  const client = new Client({
    user: user,
    host: host,
    database: db,
    password: pass,
    port: port
  });

  try {
    await client.connect();
    const res = await client.query('SHOW SERVER_ENCODING;');
    return res.rows[0].server_encoding;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to connect to database');
  } finally {
    await client.end();
  }
}

export async function getMysqlEncoding(config: any) {
  let connection: Connection | undefined;
  const { host, port, db, pass, user } = config;

  try {
    connection = await createConnection({
      user: user,
      host: host,
      database: db,
      password: pass,
      port: port
    });
    const [rows] = await connection.execute('SHOW VARIABLES LIKE "character_set_database";');
    const result: any = rows;
    return result[0].Value;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to connect to database');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

import {
  GetConnectionRequest,
  GetConnectionResponse,
  GetConnectionsRequest,
  CreateConnectionRequest,
  CheckConnectionConfigRequest,
  IsConnectionNameAvailableRequest,
  UpdateConnectionRequest,
  DeleteConnectionRequest,
  GetConnectionSchemaRequest,
  DatabaseColumn,
  GetConnectionUniqueConstraintsRequest,
  PostgresConnectionConfig,
  PostgresConnection,
  ConnectionConfig,
  MysqlConnectionConfig,
  MysqlConnection,
  Connection,
  GetConnectionForeignConstraintsRequest,
  GetConnectionPrimaryConstraintsRequest
} from '@neosync/sdk';
import { getNeosyncContext } from '../config/neosync';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import { createConnectionConfig } from '../utils/utils';
// import { Connection as PrismaConnection } from '@prisma/client';;
import prisma from '../client';
import { encryptPassword } from '../utils/encryption';
import { getMysqlEncoding, getPostgresEncoding } from '../utils/getEncode';
// import generateConConfig from '../utils/connectionConfig';

const client = getNeosyncContext();

export async function getConnections(accountId: string) {
  const result = await client.connections.getConnections(
    new GetConnectionsRequest({
      accountId
    })
  );

  return result.connections;
}

export async function checkConnectionConfig(
  accountId: string,
  db: any,
  tunnel: any,
  connection_type: string
) {
  const connectionConfig = createConnectionConfig(connection_type, db);

  const check = await client.connections.checkConnectionConfig(
    new CheckConnectionConfigRequest({
      connectionConfig
    })
  );

  return check;
}

export async function chekcConnectionEncoding(accountId: string, db: any, connection_type: string) {
  let encode;

  if (connection_type == 'postgresql') {
    encode = await getPostgresEncoding({
      host: db.host,
      port: db.port,
      db: db.name,
      pass: db.pass,
      user: db.user
    });
  } else if (connection_type == 'mysql') {
    encode = await getMysqlEncoding({
      host: db.host,
      port: db.port,
      db: db.name,
      pass: db.pass,
      user: db.user
    });
  }

  return encode;
}

export async function isConnectionNameAvailable(accountId: string, name: string) {
  const is_available = await client.connections.isConnectionNameAvailable(
    new IsConnectionNameAvailableRequest({
      accountId,
      connectionName: name
    })
  );

  return is_available.isAvailable;
}

export async function getConnection(accountId: string, connectionId: string): Promise<Connection> {
  const connection = await client.connections.getConnection(
    new GetConnectionRequest({
      id: connectionId
    })
  );

  if (connection.connection?.accountId !== accountId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Connection not found');
  }

  return connection.connection;
}

export async function createConnection(
  connection_type: string,
  accountId: string,
  name: string,
  connection_config: any
): Promise<Connection | undefined> {
  const connectionConfig = createConnectionConfig(connection_type, connection_config);

  const connection = await client.connections.createConnection(
    new CreateConnectionRequest({
      name,
      accountId,
      connectionConfig
    })
  );

  const hashedUser = await encryptPassword(connection_config.user);
  const hashedPass = await encryptPassword(connection_config.pass);
  const hashedHost = await encryptPassword(connection_config.host);
  const handhedName = await encryptPassword(connection_config.name);

  try {
    const prismaConn = prisma.connection.create({
      data: {
        engine_id: connection.connection?.id ?? '',
        name: connection.connection?.name ?? '',
        connectionConfig: {
          host: hashedHost,
          name: handhedName,
          user: hashedUser,
          pass: hashedPass,
          port: connection_config.port
        }
      }
    });
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, 'prsimna error');
  }

  return connection.connection;
}

export async function updateConnection(
  connection_type: string,
  id: string,
  name: string,
  connection_config: any
) {
  const connectionConfig = createConnectionConfig(connection_type, connection_config);

  return await client.connections.updateConnection(
    new UpdateConnectionRequest({
      id,
      name,
      connectionConfig
    })
  );
}

export async function deleteConnection(connectionId: string) {
  return await client.connections.deleteConnection(
    new DeleteConnectionRequest({
      id: connectionId
    })
  );
}

export async function checkConnectionSchema(connectionId: string) {
  const schemas = await client.connectiondata.getConnectionSchema(
    new GetConnectionSchemaRequest({
      connectionId
    })
  );

  const map: Record<string, DatabaseColumn[]> = {};

  schemas.schemas.forEach((dbcol) => {
    const key = `${dbcol.schema}.${dbcol.table}`;
    const cols = map[key];
    if (!cols) {
      map[key] = [dbcol];
    } else {
      cols.push(dbcol);
    }
  });
  return map;
}

export async function getConnectionUniqueConstrains(connectionId: string) {
  const res = await client.connectiondata.getConnectionUniqueConstraints(
    new GetConnectionUniqueConstraintsRequest({
      connectionId
    })
  );

  return res.tableConstraints;
}

export async function getConnectionForeignConstraints(connectionId: string) {
  const constraints = await client.connectiondata.getConnectionForeignConstraints(
    new GetConnectionForeignConstraintsRequest({
      connectionId
    })
  );

  return constraints.tableConstraints;
}

export async function getConnectionPrimaryConstraints(connectionId: string) {
  const constrains = await client.connectiondata.getConnectionPrimaryConstraints(
    new GetConnectionPrimaryConstraintsRequest({
      connectionId
    })
  );

  return constrains.tableConstraints;
}

export default {
  createConnection,
  getConnection,
  getConnections,
  updateConnection,
  deleteConnection,
  checkConnectionConfig,
  checkConnectionSchema,
  getConnectionUniqueConstrains,
  getConnectionForeignConstraints,
  getConnectionPrimaryConstraints,
  isConnectionNameAvailable,
  chekcConnectionEncoding
};

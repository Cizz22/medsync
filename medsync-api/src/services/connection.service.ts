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
// import generateConConfig from '../utils/connectionConfig';

const client = getNeosyncContext();

export async function getConnections(accountId: string) {
  // const page = options.page || 1;
  // const limit = options.limit || 10;
  // const sortBy = options.sortBy || 'createdAt';
  // const sortType = options.sortType || 'desc';

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
  return connection.connection;
}

export async function updateConnection(req: UpdateConnectionRequest) {
  return await client.connections.updateConnection(req);
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
  isConnectionNameAvailable
};

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
  Connection
} from '@neosync/sdk';
import { getNeosyncContext } from '../config/neosync';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import generateConConfig from '../utils/connectionConfig';

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

export async function checkConnectionConfig(connection_type: string, connection_config: any) {
  const config = await generateConConfig(connection_type, connection_config);

  const check = await client.connections.checkConnectionConfig(
    new CheckConnectionConfigRequest({
      connectionConfig: config
    })
  );

  return check.isConnected;
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
  let config: PostgresConnectionConfig | MysqlConnectionConfig;
  let connectionCase: 'pgConfig' | 'mysqlConfig';
  let connection: GetConnectionResponse;

  switch (connection_type) {
    case 'postgresql':
      connectionCase = 'pgConfig';
      config = new PostgresConnectionConfig({
        connectionConfig: {
          case: 'connection',
          value: new PostgresConnection({
            host: connection_config.host,
            name: connection_config.name,
            user: connection_config.user,
            pass: connection_config.pass,
            port: connection_config.port,
            sslMode: connection_config.sslMode
          })
        }
      });

      connection = await client.connections.createConnection(
        new CreateConnectionRequest({
          name,
          accountId,
          connectionConfig: new ConnectionConfig({
            config: {
              case: connectionCase,
              value: config
            }
          })
        })
      );
      break;
    case 'mysql':
      const mqconfig = new MysqlConnectionConfig({
        connectionConfig: {
          case: 'connection',
          value: new MysqlConnection({
            host: connection_config.host,
            name: connection_config.name,
            user: connection_config.user,
            pass: connection_config.pass,
            port: connection_config.port,
            protocol: connection_config.protocol
          })
        }
      });

      connection = await client.connections.createConnection(
        new CreateConnectionRequest({
          name,
          accountId,
          connectionConfig: new ConnectionConfig({
            config: {
              case: 'mysqlConfig',
              value: mqconfig
            }
          })
        })
      );
      break;
    default:
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid connection type');
      break;
  }

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
  return await client.connectiondata.getConnectionUniqueConstraints(
    new GetConnectionUniqueConstraintsRequest({
      connectionId
    })
  );
}

export default {
  createConnection,
  getConnection,
  getConnections,
  updateConnection,
  deleteConnection,
  checkConnectionConfig,
  checkConnectionSchema,
  getConnectionUniqueConstrains
};

import {
  GetConnectionRequest,
  GetConnectionResponse,
  GetConnectionsRequest,
  GetConnectionsResponse,
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
  MysqlConnection
} from '@neosync/sdk';
import { getNeosyncContext } from '../config/neosync';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import generateConConfig from '../utils/connectionConfig';

const client = getNeosyncContext();

export async function getConnections(
  accountId: string,
) {
  // const page = options.page || 1;
  // const limit = options.limit || 10;
  // const sortBy = options.sortBy || 'createdAt';
  // const sortType = options.sortType || 'desc';

  const result = await client.connections.getConnections(
    new GetConnectionsRequest({
      accountId
    })
  );

  return result;
}

export async function checkConnectionConfig(connection_type: string, connection_config: any) {
  const config = await generateConConfig(connection_type, connection_config);

  return await client.connections.checkConnectionConfig(
    new CheckConnectionConfigRequest({
      connectionConfig: config
    })
  );
}

export async function isConnectionNameAvailable(accountId: string, name: string) {
  return await client.connections.isConnectionNameAvailable(
    new IsConnectionNameAvailableRequest({
      accountId,
      connectionName: name
    })
  );
}

export async function getConnection(
  accountId: string,
  connectionId: string
): Promise<GetConnectionResponse> {
  const connection = await client.connections.getConnection(
    new GetConnectionRequest({
      id: connectionId
    })
  );

  if (connection.connection?.accountId !== accountId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Connection not found');
  }

  return connection;
}

export async function createConnection(
  connection_type: string,
  accountId: string,
  name: string,
  connection_config: any
) {
  switch (connection_type) {
    case 'postgresql':
      // Validate Connection config

      const pgconfig = new PostgresConnectionConfig({
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

      return await client.connections.createConnection(
        new CreateConnectionRequest({
          name,
          accountId,
          connectionConfig: new ConnectionConfig({
            config: {
              case: 'pgConfig',
              value: pgconfig
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

      return await client.connections.createConnection(
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
      break;
  }
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

import {
  PostgresConnectionConfig,
  PostgresConnection,
  ConnectionConfig,
  MysqlConnectionConfig,
  MysqlConnection,
  JobSourceOptions,
  PostgresSourceConnectionOptions,
  MysqlSourceConnectionOptions,
  Connection,
  JobDestinationOptions,
  PostgresDestinationConnectionOptions,
  PostgresTruncateTableConfig,
  PostgresOnConflictConfig,
  MysqlOnConflictConfig,
  MysqlTruncateTableConfig,
  MysqlDestinationConnectionOptions
} from '@neosync/sdk';

//Function to create connectionconfig class based on conneciton type

export default async function generateConConfig(connection_type: string, connection_config: any) {
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

      return new ConnectionConfig({
        config: {
          case: 'pgConfig',
          value: pgconfig
        }
      });

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

      return new ConnectionConfig({
        config: {
          case: 'mysqlConfig',
          value: mqconfig
        }
      });
      break;
    default:
      break;
  }
}

export function toJobSourceOption(options: any, source: Connection) {
  switch (source.connectionConfig?.config.case) {
    case 'pgConfig':
      return new JobSourceOptions({
        config: {
          case: 'postgres',
          value: new PostgresSourceConnectionOptions({
            connectionId: source.id,
            haltOnNewColumnAddition: options.haltOnNewColumnAddition,
            subsetByForeignKeyConstraints: options?.subsetByForeignKeyConstraints,
            schemas: options?.schemas
          })
        }
      });
      break;
    case 'mysqlConfig':
      return new JobSourceOptions({
        config: {
          case: 'mysql',
          value: new MysqlSourceConnectionOptions({
            connectionId: source.id,
            haltOnNewColumnAddition: options.haltOnNewColumnAddition,
            subsetByForeignKeyConstraints: options?.subsetByForeignKeyConstraints,
            schemas: options?.schemas
          })
        }
      });
      break;
    default:
      throw new Error('Invalid connection type');
  }
}

export function toJobDestinationOption(options: any, destination: Connection) {
  if (!destination) return new JobDestinationOptions();

  switch (destination.connectionConfig?.config.case) {
    case 'pgConfig':
      return new JobDestinationOptions({
        config: {
          case: 'postgresOptions',
          value: new PostgresDestinationConnectionOptions({
            truncateTable: new PostgresTruncateTableConfig({
              truncateBeforeInsert: options.truncateBeforeInsert ?? false,
              cascade: options.truncateCascade ?? false
            }),
            onConflict: new PostgresOnConflictConfig({
              doNothing: options.doNothing ?? false
            }),
            initTableSchema: options.initTableSchema
          })
        }
      });
    case 'mysqlConfig':
      return new JobDestinationOptions({
        config: {
          case: 'mysqlOptions',
          value: new MysqlDestinationConnectionOptions({
            truncateTable: new MysqlTruncateTableConfig({
              truncateBeforeInsert: options.truncateBeforeInsert ?? false
            }),
            onConflict: new MysqlOnConflictConfig({
              doNothing: options.doNothing ?? false
            }),
            initTableSchema: options.initTableSchema
          })
        }
      });
    default:
      return new JobDestinationOptions();
  }
}

import {
  PostgresConnectionConfig,
  PostgresConnection,
  ConnectionConfig,
  MysqlConnectionConfig,
  MysqlConnection
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

// export async function toJobSourceOption(connection_config, source) {
//
//   switch(source.connectionConfig)
//
// }

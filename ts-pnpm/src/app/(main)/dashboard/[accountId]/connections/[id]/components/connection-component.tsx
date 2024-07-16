/* eslint-disable no-case-declarations */
'use client';
// import {
//   Connection,
//   PostgresConnection,
//   SSHAuthentication,
//   UpdateConnectionResponse,
// } from '@neosync/sdk';
import { ReactElement } from 'react';

import { ConnectionResponse } from '@/lib/hooks/useGetConnection';

import ConnectionIcon from '@/components/connections/ConnectionIcon';
import PageHeader from '@/components/headers/PageHeader';

// import MysqlForm from './MysqlForm';
import PostgresForm from './PostgresForm';
import MysqlForm from './MysqlForm';

interface ConnectionComponent {
  name: string;
  summary?: ReactElement;
  body: ReactElement;
  header: ReactElement;
}

interface GetConnectionComponentDetailsProps {
  connection?: ConnectionResponse;
  onSaved(updatedConnResp:ConnectionResponse): void;
  onSaveFailed(err: unknown): void;
  extraPageHeading?: ReactElement;
  subHeading?: ReactElement;
}

export function getConnectionComponentDetails(
  props: GetConnectionComponentDetailsProps
): ConnectionComponent {
  const { connection, onSaved, extraPageHeading, onSaveFailed, subHeading } =
    props;

  switch (Object.keys(connection?.connectionConfig)[0]) {
    case 'pgConfig':
      const pgValue = connection?.connectionConfig.pgConfig;
      let pgConfig;

      let dbConfig = {
        host: '',
        name: '',
        user: '',
        pass: '',
        port: 5432,
        sslMode: 'disable',
      };

      // define header type for postgres, either generic postgres or neon
      let headerType = 'generic';

      switch (Object.keys(pgValue)[0]) {
        case 'connection':
          pgConfig = pgValue.connection;
          dbConfig = {
            host: pgConfig.host ?? '',
            name: pgConfig.name ?? '',
            user: pgConfig.user ?? '',
            pass: pgConfig.pass ?? '',
            port: pgConfig.port ?? 5432,
            sslMode: pgConfig.sslMode ?? 'disable',
          };
          if (pgConfig.host.includes('neon')) {
            headerType = 'neon';
          } else {
            headerType = 'generic';
          }
          break;
        case 'url':
          pgConfig = pgValue.url;
          if (pgConfig.includes('neon')) {
            headerType = 'neon';
          } else {
            headerType = 'generic';
          }
          break;
        default:
          pgConfig = pgValue.connectionConfig.value;
          // dbConfig = dbConfig;
      }

      return {
        name: connection?.name ?? '',
        summary: (
          <div>
            <p>No summary found.</p>
          </div>
        ),
        header: (
          <PageHeader
            header={headerType == 'neon' ? 'Neon' : 'PostgreSQL'}
            leftIcon={
              headerType == 'neon' ? (
                <ConnectionIcon name="neon" />
              ) : (
                <ConnectionIcon name="postgres" />
              )
            }
            extraHeading={extraPageHeading}
            subHeadings={subHeading}
          />
        ),
        body: (
          <PostgresForm
            connectionId={connection?.id ?? ''}
            defaultValues={{
              connectionName: connection?.name ?? '',
              db: dbConfig,
              url: typeof pgConfig === 'string' ? pgConfig : '',
              options: {
                maxConnectionLimit: pgValue.connectionOptions?.maxConnectionLimit,
              },
              tunnel: {
                host: pgValue.tunnel?.host ?? '',
                port: pgValue.tunnel?.port ?? 22,
                knownHostPublicKey: pgValue.tunnel?.knownHostPublicKey ?? '',
                user: pgValue.tunnel?.user ?? '',
                passphrase:
                pgValue.tunnel && pgValue.tunnel.authentication
                    ? getPassphraseFromSshAuthentication(
                      pgValue.tunnel.authentication
                      ) ?? ''
                    : '',
                privateKey:
                pgValue.tunnel && pgValue.tunnel.authentication
                    ? getPrivateKeyFromSshAuthentication(
                      pgValue.tunnel.authentication
                      ) ?? ''
                    : '',
              },
            }}
            onSaved={(resp) => onSaved(resp)}
            onSaveFailed={onSaveFailed}
          />
        ),
      };

    case 'mysqlConfig':
      const myValue = connection?.connectionConfig.mysqlConfig;
      switch (Object.keys(myValue)[0]) {
        case 'connection':
          return {
            name: connection?.name ?? '',
            summary: (
              <div>
                <p>No summary found.</p>
              </div>
            ),
            header: (
              <PageHeader
                header="Mysql"
                leftIcon={<ConnectionIcon name="mysql" />}
                extraHeading={extraPageHeading}
                subHeadings={subHeading}
              />
            ),
            body: (
              <MysqlForm
                connectionId={connection?.id ?? ''}
                defaultValues={{
                  connectionName: connection?.name ?? '',
                  db: {
                    host: myValue.connection.host,
                    port: myValue.connection.port,
                    name: myValue.connection.name,
                    user: myValue.connection.user,
                    pass: myValue.connection.pass,
                    protocol: myValue.connection.protocol,
                  },
                  options: {
                    maxConnectionLimit:
                      myValue.connectionOptions?.maxConnectionLimit,
                  },
                  tunnel: {
                    host: myValue.tunnel?.host ?? '',
                    port: myValue.tunnel?.port ?? 22,
                    knownHostPublicKey:
                      myValue.tunnel?.knownHostPublicKey ?? '',
                    user: myValue.tunnel?.user ?? '',
                    passphrase:
                      myValue.tunnel && myValue.tunnel.authentication
                        ? getPassphraseFromSshAuthentication(
                          myValue.tunnel.authentication
                          ) ?? ''
                        : '',
                    privateKey:
                    myValue.connection.tunnel && myValue.connection.tunnel.authentication
                        ? getPrivateKeyFromSshAuthentication(
                          myValue.tunnel.authentication
                          ) ?? ''
                        : '',
                  },
                }}
                onSaved={(resp) => onSaved(resp)}
                onSaveFailed={onSaveFailed}
              />
            ),
          };
      }
      return {
        name: connection?.name ?? '',
        summary: (
          <div>
            <p>No summary found.</p>
          </div>
        ),
        header: <PageHeader header="Unknown Connection" />,
        body: (
          <div>
            No connection component found for: (
            {connection?.name ?? 'unknown name'})
          </div>
        ),
      };

    default:
      return {
        name: 'Invalid Connection',
        summary: (
          <div>
            <p>No summary found.</p>
          </div>
        ),
        header: <PageHeader header="Unknown Connection" />,
        body: (
          <div>
            No connection component found for: (
            {connection?.name ?? 'unknown name'})
          </div>
        ),
      };
  }
}

function getPassphraseFromSshAuthentication(
  sshauth:any
): string | undefined {
  switch (sshauth.authConfig.case) {
    case 'passphrase':
      return sshauth.authConfig.value.value;
    case 'privateKey':
      return sshauth.authConfig.value.passphrase;
    default:
      return undefined;
  }
}

function getPrivateKeyFromSshAuthentication(
  sshauth:any
): string | undefined {
  switch (sshauth.authConfig.case) {
    case 'privateKey':
      return sshauth.authConfig.value.value;
    default:
      return undefined;
  }
}

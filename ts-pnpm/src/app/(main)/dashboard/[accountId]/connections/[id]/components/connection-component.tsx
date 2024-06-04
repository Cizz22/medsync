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
      const value = connection?.connectionConfig.pgConfig;
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

      switch (Object.keys(value)[0]) {
        case 'connection':
          pgConfig = value.connection;
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
          pgConfig = value.url;
          if (pgConfig.includes('neon')) {
            headerType = 'neon';
          } else {
            headerType = 'generic';
          }
          break;
        default:
          pgConfig = value.connectionConfig.value;
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
                maxConnectionLimit: value.connectionOptions?.maxConnectionLimit,
              },
              tunnel: {
                host: value.tunnel?.host ?? '',
                port: value.tunnel?.port ?? 22,
                knownHostPublicKey: value.tunnel?.knownHostPublicKey ?? '',
                user: value.tunnel?.user ?? '',
                passphrase:
                  value.tunnel && value.tunnel.authentication
                    ? getPassphraseFromSshAuthentication(
                        value.tunnel.authentication
                      ) ?? ''
                    : '',
                privateKey:
                  value.tunnel && value.tunnel.authentication
                    ? getPrivateKeyFromSshAuthentication(
                        value.tunnel.authentication
                      ) ?? ''
                    : '',
              },
            }}
            onSaved={(resp) => onSaved(resp)}
            onSaveFailed={onSaveFailed}
          />
        ),
      };

    // case 'mysqlConfig':
    //   const mysqlValue = connection.connectionConfig.config.value;
    //   switch (mysqlValue.connectionConfig.case) {
    //     case 'connection':
    //       return {
    //         name: connection.name,
    //         summary: (
    //           <div>
    //             <p>No summary found.</p>
    //           </div>
    //         ),
    //         header: (
    //           <PageHeader
    //             header="Mysql"
    //             leftIcon={<ConnectionIcon name="mysql" />}
    //             extraHeading={extraPageHeading}
    //             subHeadings={subHeading}
    //           />
    //         ),
    //         body: (
    //           <MysqlForm
    //             connectionId={connection.id}
    //             defaultValues={{
    //               connectionName: connection.name,
    //               db: {
    //                 host: mysqlValue.connectionConfig.value.host,
    //                 port: mysqlValue.connectionConfig.value.port,
    //                 name: mysqlValue.connectionConfig.value.name,
    //                 user: mysqlValue.connectionConfig.value.user,
    //                 pass: mysqlValue.connectionConfig.value.pass,
    //                 protocol: mysqlValue.connectionConfig.value.protocol,
    //               },
    //               options: {
    //                 maxConnectionLimit:
    //                   mysqlValue.connectionOptions?.maxConnectionLimit,
    //               },
    //               tunnel: {
    //                 host: mysqlValue.tunnel?.host ?? '',
    //                 port: mysqlValue.tunnel?.port ?? 22,
    //                 knownHostPublicKey:
    //                   mysqlValue.tunnel?.knownHostPublicKey ?? '',
    //                 user: mysqlValue.tunnel?.user ?? '',
    //                 passphrase:
    //                   mysqlValue.tunnel && mysqlValue.tunnel.authentication
    //                     ? getPassphraseFromSshAuthentication(
    //                         mysqlValue.tunnel.authentication
    //                       ) ?? ''
    //                     : '',
    //                 privateKey:
    //                   mysqlValue.tunnel && mysqlValue.tunnel.authentication
    //                     ? getPrivateKeyFromSshAuthentication(
    //                         mysqlValue.tunnel.authentication
    //                       ) ?? ''
    //                     : '',
    //               },
    //             }}
    //             onSaved={(resp) => onSaved(resp)}
    //             onSaveFailed={onSaveFailed}
    //           />
    //         ),
    //       };
    //   }
    //   return {
    //     name: connection.name,
    //     summary: (
    //       <div>
    //         <p>No summary found.</p>
    //       </div>
    //     ),
    //     header: <PageHeader header="Unknown Connection" />,
    //     body: (
    //       <div>
    //         No connection component found for: (
    //         {connection?.name ?? 'unknown name'})
    //       </div>
    //     ),
    //   };
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

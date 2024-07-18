'use client';
import ButtonText from '@/components/ButtonText';
import FormError from '@/components/FormError';
import { PasswordInput } from '@/components/PasswordComponent';
import Spinner from '@/components/Spinner';
import RequiredLabel from '@/components/labels/RequiredLabel';
import Permissions from '@/components/permissions/Permissions';
// import { setOnboardingConfig } from '@/components/onboarding-checklist/OnboardingChecklist';
import { useAccount } from '@/components/providers/account-provider';
import SkeletonForm from '@/components/skeleton/SkeletonForm';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
// import { useGetAccountOnboardingConfig } from '@/libs/hooks/useGetAccountOnboardingConfig';
import { CheckConnectionConfigResponse, ConnectionRolePrivilege, useGetConnection } from '@/lib/hooks/useGetConnection';
import { getErrorMessage } from '@/lib/utils';
import {
  MYSQL_CONNECTION_PROTOCOLS,
  MYSQL_FORM_SCHEMA,
  MysqlFormValues,
} from '@/yup-validations/connections';
import { yupResolver } from '@hookform/resolvers/yup';
// import {
//   CheckConnectionConfigRequest,
//   CheckConnectionConfigResponse,
//   ConnectionConfig,
//   CreateConnectionRequest,
//   CreateConnectionResponse,
//   GetAccountOnboardingConfigResponse,
//   MysqlConnection,
//   MysqlConnectionConfig,
//   SSHAuthentication,
//   SSHPassphrase,
//   SSHPrivateKey,
//   SSHTunnel,
//   SqlConnectionOptions,
// } from '@neosync/sdk';
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';
import { useRouter, useSearchParams } from 'next/navigation';
// import { usePostHog } from 'posthog-js/react';
import { ReactElement, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function MysqlForm() {
  const { account } = useAccount();
  const searchParams = useSearchParams();
  const sourceConnId = searchParams.get('sourceId');
  const [isLoading, setIsLoading] = useState<boolean>();
  // const { data: onboardingData, mutate } = useGetAccountOnboardingConfig(
  //   account?.id ?? ''
  // );

  const form = useForm<MysqlFormValues>({
    resolver: yupResolver(MYSQL_FORM_SCHEMA),
    defaultValues: {
      connectionName: '',
      db: {
        host: 'localhost',
        name: 'mysql',
        user: 'mysql',
        pass: 'mysql',
        port: 3306,
        protocol: 'tcp',
      },
      options: {
        maxConnectionLimit: 80,
      },
      tunnel: {
        host: '',
        port: 22,
        knownHostPublicKey: '',
        user: '',
        passphrase: '',
        privateKey: '',
      },
    },
    context: { accountId: account?.neosync_account_id, token:account?.access_token },
  });
  const router = useRouter();

  const [validationResponse, setValidationResponse] = useState<
    CheckConnectionConfigResponse | undefined
  >();

  const [isValidating, setIsValidating] = useState<boolean>(false);
  // const posthog = usePostHog();

  const [openPermissionDialog, setOpenPermissionDialog] =
  useState<boolean>(false);
const [permissionData, setPermissionData] = useState<ConnectionRolePrivilege[]>();

  async function onSubmit(values: MysqlFormValues) {
    if (!account) {
      return;
    }
    try {
      const connection = await createMysqlConnection(
        values.db,
        values.connectionName,
        account.neosync_account_id,
        account.access_token ?? '',
        values.tunnel,
        values.options
      );
      // posthog.capture('New Connection Created', { type: 'mysql' });
      toast({
        title: 'Successfully created connection!',
        variant: 'default',
      });

      // // updates the onboarding data
      // if (onboardingData?.config?.hasCreatedSourceConnection) {
      //   try {
      //     const resp = await setOnboardingConfig(account.id, {
      //       hasCreatedSourceConnection:
      //         onboardingData.config.hasCreatedSourceConnection,
      //       hasCreatedDestinationConnection: true,
      //       hasCreatedJob: onboardingData.config.hasCreatedJob,
      //       hasInvitedMembers: onboardingData.config.hasInvitedMembers,
      //     });
      //     mutate(
      //       new GetAccountOnboardingConfigResponse({
      //         config: resp.config,
      //       })
      //     );
      //   } catch (e) {
      //     toast({
      //       title: 'Unable to update onboarding status!',
      //       variant: 'destructive',
      //     });
      //   }
      // } else {
      //   try {
      //     const resp = await setOnboardingConfig(account.id, {
      //       hasCreatedSourceConnection: true,
      //       hasCreatedDestinationConnection:
      //         onboardingData?.config?.hasCreatedSourceConnection ?? true,
      //       hasCreatedJob: onboardingData?.config?.hasCreatedJob ?? true,
      //       hasInvitedMembers:
      //         onboardingData?.config?.hasInvitedMembers ?? true,
      //     });
      //     mutate(
      //       new GetAccountOnboardingConfigResponse({
      //         config: resp.config,
      //       })
      //     );
      //   } catch (e) {
      //     toast({
      //       title: 'Unable to update onboarding status!',
      //       variant: 'destructive',
      //     });
      //   }
      // }

      const returnTo = searchParams.get('returnTo');
      if (returnTo) {
        router.push(returnTo);
      } else if (connection.connection?.id) {
        router.push(
          `/dashboard/${account?.neosync_account_id}/connections/${connection.connection.id}`
        );
      } else {
        router.push(`/dashboard/${account?.neosync_account_id}/connections`);
      }
    } catch (err) {
      console.error(err);
      toast({
        title: 'Unable to create connection',
        description: getErrorMessage(err),
        variant: 'destructive',
      });
    }
  }
  /* we call the underlying useGetConnection API directly since we can't call
the hook in the useEffect conditionally. This is used to retrieve the values for the clone connection so that we can update the form.
*/
  useEffect(() => {
    const fetchData = async () => {
      if (!sourceConnId || !account?.id) {
        return;
      }
      setIsLoading(true);

      try {
        const connData = await useGetConnection(account.neosync_account_id, account?.access_token ?? '' ,sourceConnId);
        if (
          Object.keys(connData.data?.connectionConfig)[0] !== 'mysqlConfig'
        ) {
          return;
        }

        const config = connData.data?.connectionConfig?.mysqlConfig;

        const mysqlConfig = config.connectionConfig.connection;

        const dbConfig = {
          host: '',
          name: '',
          user: '',
          pass: '',
          port: 3306,
          protocol: 'tcp',
        };
        if (typeof mysqlConfig !== 'string') {
          dbConfig.host = mysqlConfig?.host ?? '';
          dbConfig.name = mysqlConfig?.name ?? '';
          dbConfig.user = mysqlConfig?.user ?? '';
          dbConfig.pass = mysqlConfig?.pass ?? '';
          dbConfig.port = mysqlConfig?.port ?? 3306;
          dbConfig.protocol = mysqlConfig?.protocol ?? 'tcp';
        }

        let passPhrase = '';
        let privateKey = '';

        const authConfig = config.tunnel?.authentication;

        switch (Object.keys(authConfig)[0]) {
          case 'passphrase':
            passPhrase = authConfig.passphrase.assphrase;
            break;
          case 'privateKey':
            passPhrase = authConfig.privateKey.passphrase ?? '';
            privateKey = authConfig.privateKey.privateKey;
            break;
        }

        /* reset the form with the new values and include the fallback values because of our validation schema requires a string and not undefined which is okay because it will tell the user that something is wrong instead of the user not realizing that it's undefined
         */
        form.reset({
          ...form.getValues(),
          connectionName: connData?.data?.name + '-copy',
          db: dbConfig,
          // url: typeof mysqlConfig === 'string' ? mysqlConfig : '',
          tunnel: {
            host: config.tunnel?.host ?? '',
            port: config.tunnel?.port ?? 22,
            knownHostPublicKey: config.tunnel?.knownHostPublicKey ?? '',
            user: config.tunnel?.user ?? '',
            passphrase: passPhrase,
            privateKey: privateKey,
          },
        });
      } catch (error) {
        console.error('Failed to fetch connection data:', error);
        setIsLoading(false);
        toast({
          title: 'Unable to retrieve connection data for clone!',
          description: getErrorMessage(error),
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [account?.id]);

  if (isLoading || !account?.id) {
    return <SkeletonForm />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Controller
          control={form.control}
          name="connectionName"
          render={({ field: { onChange, ...field } }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel />
                Connection Name
              </FormLabel>
              <FormDescription>
                The unique name of the connection
              </FormDescription>
              <FormControl>
                <Input
                  placeholder="Connection Name"
                  {...field}
                  onChange={async ({ target: { value } }) => {
                    onChange(value);
                    await form.trigger('connectionName');
                  }}
                />
              </FormControl>
              <FormError
                errorMessage={
                  form.formState.errors.connectionName?.message ?? ''
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="db.host"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel />
                Host Name
              </FormLabel>
              <FormDescription>The host name</FormDescription>
              <FormControl>
                <Input placeholder="Host" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="db.port"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel />
                Database Port
              </FormLabel>
              <FormDescription>The database port</FormDescription>
              <FormControl>
                <Input
                  type="number"
                  placeholder="3306"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.valueAsNumber);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="db.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel />
                Database Name
              </FormLabel>
              <FormDescription>The database name</FormDescription>
              <FormControl>
                <Input placeholder="mysql" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="db.user"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel />
                Database Username
              </FormLabel>
              <FormDescription>The database username</FormDescription>
              <FormControl>
                <Input placeholder="mysql" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="db.pass"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel />
                Database Password
              </FormLabel>
              <FormDescription>The database password</FormDescription>
              <FormControl>
                <PasswordInput placeholder="mysql" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="db.protocol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabel />
                Connection Protocol
              </FormLabel>
              <FormDescription>
                The protocol that you want to use to connect to your database
              </FormDescription>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MYSQL_CONNECTION_PROTOCOLS.map((mode) => (
                      <SelectItem
                        className="cursor-pointer"
                        key={mode}
                        value={mode}
                      >
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="options.maxConnectionLimit"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Max Connection Limit</FormLabel>
                <FormDescription>
                  The maximum number of concurrent database connections allowed.
                  If set to 0 then there is no limit on the number of open
                  connections.
                </FormDescription>
              </div>
              <FormControl>
                <Input
                  {...field}
                  className="max-w-[180px]"
                  type="number"
                  value={field.value ? field.value.toString() : 80}
                  onChange={(event) => {
                    field.onChange(event.target.valueAsNumber);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="bastion">
            <AccordionTrigger> Bastion Host Configuration</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 p-2">
              <div className="text-sm">
                This section is optional and only necessary if your database is
                not publicly accessible to the internet.
              </div>
              <FormField
                control={form.control}
                name="tunnel.host"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Host</FormLabel>
                    <FormDescription>
                      The hostname of the bastion server that will be used for
                      SSH tunneling.
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="bastion.example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tunnel.port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormDescription>
                      The port of the bastion host. Typically this is port 22.
                    </FormDescription>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="22"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.valueAsNumber);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tunnel.user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <FormDescription>
                      The name of the user that will be used to authenticate.
                    </FormDescription>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tunnel.privateKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Private Key</FormLabel>
                    <FormDescription>
                      The private key that will be used to authenticate against
                      the SSH server. If using passphrase auth, provide that in
                      the appropriate field below.
                    </FormDescription>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tunnel.passphrase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passphrase / Private Key Password</FormLabel>
                    <FormDescription>
                      The passphrase that will be used to authenticate with. If
                      the SSH Key provided above is encrypted, provide the
                      password for it here.
                    </FormDescription>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tunnel.knownHostPublicKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Known Host Public Key</FormLabel>
                    <FormDescription>
                      The public key of the host that will be expected when
                      connecting to the tunnel. This should be in the format
                      like what is found in the `~/.ssh/known_hosts` file,
                      excluding the hostname. If this is not provided, any host
                      public key will be accepted.
                    </FormDescription>
                    <FormControl>
                      <Input
                        placeholder="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAlkjd9s7aJkfdLk3jSLkfj2lk3j2lkfj2l3kjf2lkfj2l"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Permissions
          data={permissionData ?? []}
          openPermissionDialog={openPermissionDialog}
          setOpenPermissionDialog={setOpenPermissionDialog}
          isValidating={isValidating}
          validationResponse={validationResponse?.isConnected ?? false}
          connectionName={form.getValues('connectionName')}
        />
        <div className="flex flex-row gap-3 justify-between">
          <Button
            variant="outline"
            disabled={!form.formState.isValid}
            onClick={async () => {
              setIsValidating(true);
              try {
                const res = await checkMysqlConnection(
                  form.getValues().db,
                  form.getValues().tunnel,
                  account?.neosync_account_id ?? '',
                  account?.access_token ?? ''
                );

        
                
                setIsValidating(false);
                setValidationResponse(res);
                setPermissionData(res.privileges);
                setOpenPermissionDialog(res?.isConnected && true);
              } catch (err) {
                setValidationResponse({
                    isConnected: false,
                    connectionError:
                      err instanceof Error ? err.message : 'unknown error',
                  });
                setIsValidating(false);
              }
            }}
            type="button"
          >
            <ButtonText
              leftIcon={
                isValidating ? (
                  <Spinner className="text-black dark:text-white" />
                ) : (
                  <div></div>
                )
              }
              text="Test Connection"
            />
          </Button>

          <Button type="submit" disabled={!form.formState.isValid}>
            <ButtonText
              leftIcon={form.formState.isSubmitting ? <Spinner /> : <div></div>}
              text="Submit"
            />
          </Button>
        </div>
        {validationResponse && !validationResponse.isConnected && (
          <ErrorAlert
            title="Unable to connect"
            description={
              validationResponse.connectionError ?? 'no error returned'
            }
          />
        )}
        {validationResponse && validationResponse.isConnected && (
          <SuccessAlert description={'Successfully connected!'} />
        )}
      </form>
    </Form>
  );
}

interface SuccessAlertProps {
  description: string;
}

function SuccessAlert(props: SuccessAlertProps): ReactElement {
  const { description } = props;
  return (
    <Alert variant="default">
      <div className="flex flex-row items-center gap-2">
        <CheckCircledIcon className="h-4 w-4 text-green-900 dark:text-green-400" />
        <div className="font-normal text-green-900 dark:text-green-400">
          {description}
        </div>
      </div>
    </Alert>
  );
}

interface ErrorAlertProps {
  title: string;
  description: string;
}

function ErrorAlert(props: ErrorAlertProps): ReactElement {
  const { title, description } = props;
  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
async function createMysqlConnection(
  db: MysqlFormValues['db'],
  name: string,
  accountId: string,
  token:string,
  tunnel: MysqlFormValues['tunnel'],
  options: MysqlFormValues['options']
) {
  const mysqlconfig = {
    connectionConfig: {
      case: 'connection',
      value: {
        host: db.host,
        name: db.name,
        user: db.user,
        pass: db.pass,
        port: db.port,
        protocol: db.protocol,
      },
    },
    tunnel: {
      host: '',
      port: 22,
      user: '',
      knownHostPublicKey: '',
      authentication: {
        authConfig: {
          case: '',
          value: {
            value: '',
            passphrase: '',
          }
        },
      }
    },
    connectionOptions: {
      maxConnectionLimit: 80
    }
  };
  if (options && options.maxConnectionLimit != 0) {
    mysqlconfig.connectionOptions = {
      maxConnectionLimit: options.maxConnectionLimit as number,
    };
  }
  if (tunnel && tunnel.host) {
    mysqlconfig.tunnel = {
      host: tunnel.host,
      port: tunnel.port as number,
      user: tunnel.user as string,
      knownHostPublicKey: tunnel.knownHostPublicKey ?? '',
      authentication: {
        authConfig: {
          case: '',
          value: {
            value: '',
            passphrase: '',
          }
        },
      }
    };
    if (tunnel.privateKey) {
      mysqlconfig.tunnel.authentication = {
        authConfig: {
          case: 'privateKey',
          value: {
            value: tunnel.privateKey,
            passphrase: tunnel.passphrase as string,
          },
        },
      };
    } else if (tunnel.passphrase) {
      mysqlconfig.tunnel.authentication = {
        authConfig: {
          case: 'passphrase',
          value: {
            value: tunnel.passphrase,
            passphrase: '',
          },
        },
      };
    }
  }
  const res = await fetch(`/api/accounts/${accountId}/connections`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'token':token
    },
    body: JSON.stringify({
        name,
        connection_type: 'mysql',
        connection_config: mysqlconfig.connectionConfig.value
      })
    });

  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.message);
  }
  return await res.json();
}

export async function checkMysqlConnection(
  db: MysqlFormValues['db'],
  tunnel: MysqlFormValues['tunnel'],
  accountId: string,
  token:string
): Promise<CheckConnectionConfigResponse> {
  // let tunnel: SSHTunnel | undefined = undefined;
  // if (tunnelForm && tunnelForm.host && tunnelForm.port && tunnelForm.user) {
  //   tunnel = new SSHTunnel({
  //     host: tunnelForm.host,
  //     port: tunnelForm.port,
  //     user: tunnelForm.user,
  //     knownHostPublicKey: tunnelForm.knownHostPublicKey
  //       ? tunnelForm.knownHostPublicKey
  //       : undefined,
  //   });
  //   if (tunnelForm.privateKey) {
  //     tunnel.authentication = new SSHAuthentication({
  //       authConfig: {
  //         case: 'privateKey',
  //         value: new SSHPrivateKey({
  //           value: tunnelForm.privateKey,
  //           passphrase: tunnelForm.passphrase,
  //         }),
  //       },
  //     });
  //   } else if (tunnelForm.passphrase) {
  //     tunnel.authentication = new SSHAuthentication({
  //       authConfig: {
  //         case: 'passphrase',
  //         value: new SSHPassphrase({
  //           value: tunnelForm.passphrase,
  //         }),
  //       },
  //     });
  //   }
  // }

  let requestBody = { db, tunnel, connection_type: 'mysql' };

  const res = await fetch(`/api/accounts/${accountId}/connections/check`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'token': token
    },
    body: JSON.stringify(requestBody),
  });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.message);
  }
  return await res.json();
}

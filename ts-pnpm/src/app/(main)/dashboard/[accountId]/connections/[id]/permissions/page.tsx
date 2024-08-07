'use client';
// import { PlainMessage } from '@bufbuild/protobuf';
// import {
//   CheckConnectionConfigResponse,
//   ConnectionRolePrivilege,
//   GetConnectionResponse,
//   PostgresConnectionConfig,
// } from '@neosync/sdk';
import { UpdateIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import Error from 'next/error';
import { useState } from 'react';
import { KeyedMutator } from 'swr';

import { CheckConnectionConfigResponse, ConnectionRolePrivilege, useGetConnection } from '@/lib/hooks/useGetConnection';
// import { useTestProgressConnection } from '@/libs/hooks/useTestPostgresConnection';
import { TestProgressConnection } from '@/lib/hooks/useTestProgressConnection';

import { CloneConnectionButton } from '@/components/CloneConnectionButton';
import OverviewContainer from '@/components/containers/OverviewContainer';
import LearnMoreTag from '@/components/labels/LearnMoreTag';
import { getPermissionColumns } from '@/components/permissions/columns';
import { TestConnectionResult } from '@/components/permissions/Permissions';
import PermissionsDataTable from '@/components/permissions/PermissionsDataTable';
import { useAccount } from '@/components/providers/account-provider';
import ResourceId from '@/components/ResourceId';
import SkeletonForm from '@/components/skeleton/SkeletonForm';
import Spinner from '@/components/Spinner';
import { SubNav } from '@/components/SubNav';
import { PageProps } from '@/components/types';
import { Button } from '@/components/ui/button';
import { toast, useToast } from '@/components/ui/use-toast';

import { getErrorMessage } from '@/lib/utils';

import { getConnectionComponentDetails } from '../components/connection-component';
import RemoveConnectionButton from '../components/RemoveConnectionButton';

export default function PermissionsPage({ params }: PageProps) {
  const id = params?.id ?? '';
  const { account } = useAccount();
  const { data, isLoading, mutate } = useGetConnection(account?.neosync_account_id ?? '', account?.access_token ?? '', id);

  const isPgConfig = Object.keys(data?.connectionConfig)[0] == 'pgConfig'

  const {
    data: validationRes,
    isLoading: isLoadingValidation,
    mutate: mutateValidation,
  } = TestProgressConnection(
    account?.neosync_account_id ?? '',
    account?.neosync_account_id ?? '',
    isPgConfig ? data?.connectionConfig.pgConfig : data?.connectionConfig.mysqlConfig
  );

  const { toast } = useToast();
  if (!id) {
    return <Error statusCode={404} />;
  }
  if (isLoading || isLoadingValidation) {
    return (
      <div className="mt-10">
        <SkeletonForm />
      </div>
    );
  }
  if (!isLoading && !data) {
    return <Error statusCode={404} />;
  }

  const connectionComponent = getConnectionComponentDetails({
    connection: data,
    onSaved: (resp) => {
      mutate(resp);
      toast({
        title: 'Successfully updated connection!',
        variant: 'default',
      });
    },
    onSaveFailed: (err) =>
      toast({
        title: 'Unable to update connection',
        description: getErrorMessage(err),
        variant: 'destructive',
      }),
    extraPageHeading: (
      <div className="flex flex-row items-center gap-4">
        {data?.connectionConfig &&
          data?.id && (
            <CloneConnectionButton
              connectionType={
                Object.keys(data?.connectionConfig)[0] ?? ''
              }
              id={data?.id ?? ''}
            />
          )}
        <RemoveConnectionButton connectionId={id} />
      </div>
    ),
    subHeading: (
      <ResourceId
        labelText={data?.id ?? ''}
        copyText={data?.id ?? ''}
        onHoverText="Copy the connection id"
      />
    ),
  });

  const basePath = `/dashboard/${account?.neosync_account_id}/connections/${data?.id}`;

  const subnav = [
    {
      title: 'Configuration',
      href: `${basePath}`,
    },
    {
      title: 'Permissions',
      href: `${basePath}/permissions`,
    },
  ];

  const columns = getPermissionColumns();

  return (
    <OverviewContainer
      Header={connectionComponent.header}
      containerClassName="px-32"
    >
      <div className="connection-details-container">
        <div className="flex flex-col gap-8">
          <SubNav items={subnav} />
          <div>
            <PermissionsPageContainer
              data={validationRes?.privilages ?? []}
              validationResponse={validationRes?.isConnected ?? false}
              connectionName={data?.name ?? ''}
              columns={columns}
              mutateValidation={mutateValidation}
            />
          </div>
        </div>
      </div>
    </OverviewContainer>
  );
}

interface PermissionsPageContainerProps {
  connectionName: string;
  data: ConnectionRolePrivilege[];
  validationResponse: boolean;
  columns: ColumnDef<ConnectionRolePrivilege>[];
  mutateValidation:
  | KeyedMutator<unknown>
  | KeyedMutator<CheckConnectionConfigResponse>;
}

function PermissionsPageContainer(props: PermissionsPageContainerProps) {
  const {
    data,
    connectionName,
    validationResponse,
    columns,
    mutateValidation,
  } = props;

  const [isMutating, setIsMutating] = useState<boolean>(false);

  const handleMutate = async () => {
    setIsMutating(true);
    try {
      await mutateValidation();
    } catch (error) {
      toast({
        title: 'Unable to update Permissions table!',
        variant: 'destructive',
      });
    }
    setIsMutating(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center w-full">
        <div className="text-muted-foreground text-sm">
          Review the permissions that Neoynsc has to your connection.{' '}
          <LearnMoreTag href="https://docs.neosync.dev/transformers/user-defined#transform-character-scramble" />
        </div>
        <Button variant="outline" onClick={handleMutate}>
          {isMutating ? <Spinner /> : <UpdateIcon />}
        </Button>
      </div>

      <TestConnectionResult
        resp={validationResponse}
        connectionName={connectionName}
        data={data}
      />
      <PermissionsDataTable data={data} columns={columns} />
    </div>
  );
}

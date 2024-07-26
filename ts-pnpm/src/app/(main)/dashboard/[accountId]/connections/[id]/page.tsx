'use client';
// import { GetConnectionResponse } from '@neosync/sdk';
import Error from 'next/error';

import { useGetConnection } from '@/lib/hooks/useGetConnection';
import { getErrorMessage } from '@/lib/utils';

import { CloneConnectionButton } from '@/components/CloneConnectionButton';
import OverviewContainer from '@/components/containers/OverviewContainer';
import { useAccount } from '@/components/providers/account-provider';
import ResourceId from '@/components/ResourceId';
import SkeletonForm from '@/components/skeleton/SkeletonForm';
import { SubNav } from '@/components/SubNav';
import { PageProps } from '@/components/types';
import { useToast } from '@/components/ui/use-toast';

import { getConnectionComponentDetails } from './components/connection-component';
import RemoveConnectionButton from './components/RemoveConnectionButton';
import { useGetConnectionSchemaMap } from '@/lib/hooks/useGetConnectionSchemaMap';
import { useGetConnectionPrimaryConstraints } from '@/lib/hooks/useGetConnectionPrimaryConstraints';
import { useGetConnectionForeignConstraints } from '@/lib/hooks/useGetConnectionForeignConstraints';
import { useGetConnectionUniqueConstraints } from '@/lib/hooks/useGetConnectionUniqueConstraints';
import { useMemo } from 'react';
import { getSchemaConstraintHandler } from '@/components/jobs/SchemaTable/schema-constraint-handler';
import { SchemaTable } from '@/components/jobs/SchemaTable/SchemaTable';
import { getSchemaColumns } from '@/components/jobs/SchemaTable/SchemaColumns';
import { useGetTransformersHandler } from '@/lib/hooks/useGetTransformersHandler';
import SchemaPageTable from '@/components/jobs/SchemaTable/SchemaPageTable';

export default function ConnectionPage({ params }: PageProps) {
  const id = params?.id ?? '';
  const { account } = useAccount();
  const { data, isLoading, mutate } = useGetConnection(account?.neosync_account_id as string, account?.access_token as string, id);
  const { toast } = useToast();

  const { data: connectionSchemaDataMap, isValidating: isSchemaMapValidating } =
    useGetConnectionSchemaMap(account?.neosync_account_id ?? '', account?.access_token ?? '', id);

  const { data: primaryConstraints, isValidating: isPkValidating } =
    useGetConnectionPrimaryConstraints(
      account?.neosync_account_id ?? '',
      id,
      account?.access_token ?? '',
    );

  const { data: foreignConstraints, isValidating: isFkValidating } =
    useGetConnectionForeignConstraints(
      account?.neosync_account_id ?? '',
      id,
      account?.access_token ?? '',
    );

  const { data: uniqueConstraints, isValidating: isUCValidating } =
    useGetConnectionUniqueConstraints(
      account?.neosync_account_id ?? '',
      account?.access_token ?? '',
      id,
    );

  const { handler, isValidating } = useGetTransformersHandler(
    account?.neosync_account_id ?? '',
    account?.access_token ?? ''
  );


  const schemaConstraintHandler = useMemo(
    () =>
      getSchemaConstraintHandler(
        connectionSchemaDataMap ?? {},
        primaryConstraints ?? {},
        foreignConstraints ?? {},
        uniqueConstraints ?? {}
      ),
    [isSchemaMapValidating, isPkValidating, isFkValidating, isUCValidating]
  );

  const columns = useMemo(() => {
    return getSchemaColumns({
      transformerHandler: handler,
      constraintHandler: schemaConstraintHandler,
      jobType: 'sync',
    });
  }, [handler, schemaConstraintHandler]);

  const mapping = Object.values(connectionSchemaDataMap ?? {}).flatMap(array =>
    array.map(({ dataType, isNullable, ...rest }) => rest)
  );


  if (!id) {
    return <Error statusCode={404} />;
  }
  if (isLoading) {
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
        {data?.connectionConfig?.config &&
          data?.id && (
            <CloneConnectionButton
              connectionType={Object.keys(data?.connectionConfig)[0] ?? ''
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
    // {
    //   title: 'Permissions',
    //   href: `${basePath}/permissions`,
    // },
  ];

  const isPostgres = Object.keys(data?.connectionConfig)[0] == 'pgConfig';

  return (
    <OverviewContainer
      Header={connectionComponent.header}
      containerClassName="px-32"
    >
      <div className="connection-details-container">
        <div className="flex flex-col gap-8">
          <SchemaPageTable
            columns={columns}
            data={mapping}
            transformerHandler={handler}
            constraintHandler={schemaConstraintHandler}
            jobType={'sync'}
          />
          <hr />
          {isPostgres && <SubNav items={subnav} buttonClassName="" />}
          <div>{connectionComponent.body}</div>
        </div>
      </div>
    </OverviewContainer>
  );
}

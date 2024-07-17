'use client';

import { yupResolver } from '@hookform/resolvers/yup';
// import {
//   DatabaseColumn,
//   ForeignConstraintTables,
//   PrimaryConstraint,
// } from '@neosync/sdk';
import { useRouter } from 'next/navigation';
import { ReactElement, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import useFormPersist from 'react-hook-form-persist';
import { useSessionStorage } from 'usehooks-ts';

import { ForeignConstrainsTable, useGetConnectionForeignConstraints } from '@/lib/hooks/useGetConnectionForeignConstraints';
import { PrimaryConstrains, useGetConnectionPrimaryConstraints } from '@/lib/hooks/useGetConnectionPrimaryConstraints';
import { DatabaseColumn, useGetConnectionSchemaMap } from '@/lib/hooks/useGetConnectionSchemaMap';
import { useGetConnectionUniqueConstraints } from '@/lib/hooks/useGetConnectionUniqueConstraints';

import OverviewContainer from '@/components/containers/OverviewContainer';
import PageHeader from '@/components/headers/PageHeader';
import { getSchemaConstraintHandler } from '@/components/jobs/SchemaTable/schema-constraint-handler';
import { SchemaTable } from '@/components/jobs/SchemaTable/SchemaTable';
import { useAccount } from '@/components/providers/account-provider';
import { PageProps } from '@/components/types';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { SCHEMA_FORM_SCHEMA, SchemaFormValues } from '@/yup-validations/jobs';

import JobsProgressSteps, { DATA_SYNC_STEPS } from '../JobsProgressSteps';
import { ConnectFormValues } from '../schema';

const isBrowser = () => typeof window !== 'undefined';

export interface ColumnMetadata {
  pk: { [key: string]: PrimaryConstrains };
  fk: { [key: string]: ForeignConstrainsTable };
  isNullable: DatabaseColumn[];
}

export default function Page({ searchParams }: PageProps): ReactElement {
  const { account } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!searchParams?.sessionId) {
      router.push(`/${account?.name}/new/job`);
    }
  }, [searchParams?.sessionId]);

  const sessionPrefix = searchParams?.sessionId ?? '';

  const [connectFormValues] = useSessionStorage<ConnectFormValues>(
    `${sessionPrefix}-new-job-connect`,
    {
      sourceId: '',
      sourceOptions: {},
      destinations: [{ connectionId: '', destinationOptions: {} }],
    }
  );

  const [schemaFormData] = useSessionStorage<SchemaFormValues>(
    `${sessionPrefix}-new-job-schema`,
    {
      mappings: [],
      connectionId: '', // hack to track if source id changes
    }
  );

  const { data: connectionSchemaDataMap, isValidating: isSchemaMapValidating } =
    useGetConnectionSchemaMap(account?.neosync_account_id ?? '', account?.access_token ?? '' ,connectFormValues.sourceId);

  const { data: primaryConstraints, isValidating: isPkValidating } =
    useGetConnectionPrimaryConstraints(
      account?.neosync_account_id ?? '',
      connectFormValues.sourceId,
      account?.access_token ?? '',
    );

  const { data: foreignConstraints, isValidating: isFkValidating } =
    useGetConnectionForeignConstraints(
      account?.neosync_account_id ?? '',
      connectFormValues.sourceId,
      account?.access_token ?? '',
    );

  const { data: uniqueConstraints, isValidating: isUCValidating } =
    useGetConnectionUniqueConstraints(
      account?.neosync_account_id ?? '',
      account?.access_token ?? '',
      connectFormValues.sourceId,
    );

  const form = useForm<SchemaFormValues>({
    resolver: yupResolver<SchemaFormValues>(SCHEMA_FORM_SCHEMA),
    values: getFormValues(connectFormValues.sourceId, schemaFormData),
  });

  useFormPersist(`${sessionPrefix}-new-job-schema`, {
    watch: form.watch,
    setValue: form.setValue,
    storage: isBrowser() ? window.sessionStorage : undefined,
  });

  async function onSubmit(_values: SchemaFormValues) {
    if (!account) {
      return;
    }
    router.push(`/dashboard/${account?.neosync_account_id}/new/job/subset?sessionId=${sessionPrefix}`);
  }
  

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

  // eslint-disable-next-line no-console
  

  return (
    <div className="flex flex-col gap-5">
      <OverviewContainer
        Header={
          <PageHeader
            header="Schema"
            progressSteps={
              <JobsProgressSteps steps={DATA_SYNC_STEPS} stepName={'schema'} />
            }
          />
        }
        containerClassName="connect-page"
      >
        <div />
      </OverviewContainer>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <SchemaTable
            data={form.watch('mappings')}
            jobType="sync"
            constraintHandler={schemaConstraintHandler}
            schema={connectionSchemaDataMap ?? {}}
            isSchemaDataReloading={isSchemaMapValidating}
          />
          <div className="flex flex-row gap-1 justify-between">
            <Button key="back" type="button" onClick={() => router.back()}>
              Back
            </Button>
            <Button key="submit" type="submit">
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function getFormValues(
  connectionId: string,
  existingData: SchemaFormValues | undefined
): SchemaFormValues {
  const existingMappings = existingData?.mappings ?? [];
  if (
    existingData &&
    existingMappings.length > 0 &&
    existingData.connectionId === connectionId
  ) {
    return existingData;
  }

  return {
    mappings: [],
    connectionId,
  };
}

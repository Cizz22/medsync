/* eslint-disable no-empty-pattern */
'use client';
import { PlusIcon } from '@radix-ui/react-icons';
import NextLink from 'next/link';
import { ReactElement, useMemo } from 'react';

import { useGetConnections } from '@/lib/hooks/useGetConnections';

import ButtonText from '@/components/ButtonText';
import OverviewContainer from '@/components/containers/OverviewContainer';
import PageHeader from '@/components/headers/PageHeader';
import { useAccount } from '@/components/providers/account-provider';
import SkeletonTable from '@/components/skeleton/SkeletonTable';
import { Button } from '@/components/ui/button';

import { getColumns } from './components/ConnectionsTable/columns';
import { DataTable } from './components/ConnectionsTable/data-table';

export default function Connections(): ReactElement {
  return (
    <OverviewContainer
      Header={
        <PageHeader
          header="Connections"
          extraHeading={<NewConnectionButton />}
        />
      }
      containerClassName="connections-page"
    >
      <ConnectionTable />
    </OverviewContainer>
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ConnectionTableProps { }

function ConnectionTable(props: ConnectionTableProps): ReactElement {
  const { } = props;
  const { account } = useAccount();
  const { isLoading, data, mutate } = useGetConnections(account?.neosync_account_id, account?.access_token);

  const columns = useMemo(
    () =>
      getColumns({
        accountName: account?.neosync_account_id ?? '',
        onConnectionDeleted() {
          mutate();
        },
      }),
    [account?.neosync_account_id, mutate]
  );

  if (isLoading) {
    return <SkeletonTable />;
  }

  const connections = data ?? [];

  return (
    <div>
      <DataTable columns={columns} data={connections} />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NewConnectionButtonprops { }

function NewConnectionButton(props: NewConnectionButtonprops): ReactElement {
  const { } = props;
  const { account } = useAccount();
  return (
    <NextLink href={`/${account?.name}/new/connection`}>
      <Button>
        <ButtonText leftIcon={<PlusIcon />} text="New Connection" />
      </Button>
    </NextLink>
  );
}

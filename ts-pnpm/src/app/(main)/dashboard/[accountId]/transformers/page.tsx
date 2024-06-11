'use client';
import { PlusIcon } from '@radix-ui/react-icons';
import NextLink from 'next/link';
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';
import { ReactElement, useMemo } from 'react';

import { useGetSystemTransformers } from '@/lib/hooks/useGetSystemTransformers';

// import { useGetUserDefinedTransformers } from '@/lib/hooks/useGetUserDefinedTransformers';
import ButtonText from '@/components/ButtonText';
import OverviewContainer from '@/components/containers/OverviewContainer';
import PageHeader from '@/components/headers/PageHeader';
import { useAccount } from '@/components/providers/account-provider';
import SkeletonTable from '@/components/skeleton/SkeletonTable';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { getSystemTransformerColumns } from './components/SystemTransformersTable/columns';
import { SystemTransformersDataTable } from './components/SystemTransformersTable/data-table';
// import { getUserDefinedTransformerColumns } from './components/UserDefinedTransformersTable/columns';
// import { UserDefinedTransformersDataTable } from './components/UserDefinedTransformersTable/data-table';

export default function Transformers(): ReactElement {
  const searchParams = useSearchParams();
  const defaultTab = getTableTabFromParams(searchParams);
  return (
    <OverviewContainer
      Header={
        <PageHeader
          header="Transformers"
        />
      }
      containerClassName="transformer-page"
    >
      <TransformersTable defaultTab={defaultTab} />
    </OverviewContainer>
  );
}

function getTableTabFromParams(
  searchParams: ReadonlyURLSearchParams
): TableTab {
  const tab = searchParams.get('tab');
  return tab && isTableTab(tab) ? tab : 'ud';
}

function isTableTab(input: string): input is TableTab {
  return input === 'ud' || input === 'system';
}

type TableTab = 'ud' | 'system';

interface TransformersTableProps {
  defaultTab: TableTab;
}

function TransformersTable(props: TransformersTableProps): ReactElement {
  const { defaultTab } = props;
  const { account } = useAccount();
  const { data, isLoading: transformersIsLoading } = useGetSystemTransformers(account?.access_token ?? '');
  // const {
  //   data: udTransformers,
  //   isLoading: userDefinedTransformersLoading,
  //   mutate: userDefinedTransformerMutate,
  // } = useGetUserDefinedTransformers(account?.neosync_account_id ?? '', account?.access_token ?? '');

  const systemTransformers = data ?? [];
  // const userDefinedTransformers = udTransformers ?? [];

  // memoizing these columns to prevent infinite re-render when hovering over next link
  const systemTransformerColumns = useMemo(
    () =>
      getSystemTransformerColumns({
        accountName: account?.neosync_account_id ?? '',
      }),
    [account?.neosync_account_id]
  );
  // memoizing these columns to prevent infinite re-render when hovering over next link
  // const userDefinedTransformerColumns = useMemo(
  //   () =>
  //     getUserDefinedTransformerColumns({
  //       onTransformerDeleted() {
  //         userDefinedTransformerMutate();
  //       },
  //       accountName: account?.neosync_account_id ?? '',
  //     }),
  //   [account?.neosync_account_id]
  // );

  if (transformersIsLoading) {
    return <SkeletonTable />;
  }

  return (
    <div>
      <Tabs defaultValue="system">
        <TabsList>
          {/* <TabsTrigger value="ud">User Defined Transformers</TabsTrigger> */}
          <TabsTrigger value="system">System Transformers</TabsTrigger>
        </TabsList>
        <TabsContent value="ud">
          {/* <UserDefinedTransformersDataTable
            columns={userDefinedTransformerColumns}
            data={userDefinedTransformers}
          /> */}
        </TabsContent>
        <TabsContent value="system">
          <SystemTransformersDataTable
            columns={systemTransformerColumns}
            data={systemTransformers}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// function NewTransformerButton(): ReactElement {
//   const { account } = useAccount();
//   return (
//     <NextLink href={`/dashboard/${account?.name}/new/transformer`}>
//       <Button>
//         <ButtonText leftIcon={<PlusIcon />} text="New Transformer" />
//       </Button>
//     </NextLink>
//   );
// }

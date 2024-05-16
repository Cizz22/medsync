'use client';
import { ReactElement } from 'react';

import AccountPageRedirect from '@/components/AccountPageRedirect';
import OverviewContainer from '@/components/containers/OverviewContainer';
import PageHeader from '@/components/headers/PageHeader';
import { useAccount } from '@/components/providers/account-provider';
import SkeletonTable from '@/components/skeleton/SkeletonTable';

export default function AccountPage(): ReactElement {
  const { account } = useAccount();
  return (
    <AccountPageRedirect>
      <OverviewContainer
        Header={<PageHeader header={`Home - ${account?.name}`} />}
        containerClassName="home-page"
      >
        <div className="flex flex-col gap-4">
          <SkeletonTable />
        </div>
      </OverviewContainer>
    </AccountPageRedirect>
  );
}

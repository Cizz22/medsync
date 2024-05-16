'use client';
import { ReactElement } from 'react';

import AccountPageRedirect from '@/components/AccountPageRedirect';
import OverviewContainer from '@/components/containers/OverviewContainer';
import PageHeader from '@/components/headers/PageHeader';
import { useAccount } from '@/components/providers/account-provider';
import SkeletonTable from '@/components/skeleton/SkeletonTable';

export default function Home(): ReactElement {
  return (
    <AccountPageRedirect>
      <SkeletonTable />
    </AccountPageRedirect>
  );
}

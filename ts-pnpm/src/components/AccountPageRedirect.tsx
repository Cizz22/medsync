'use client';

import Error from 'next/error';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

import { useAccount } from './providers/account-provider';
import { Skeleton } from './ui/skeleton';

interface Props {
  children: ReactNode;
}

export default function AccountPageRedirect(props: Props): JSX.Element {
  const { children } = props;

  const router = useRouter();
  const { account, isLoading } = useAccount();

  useEffect(() => {
    if (isLoading || !account?.name) {
      return;
    }
    router.push(`/dashboard/${account.neosync_account_id}/jobs`);
  }, [isLoading, account?.name, account?.id, account?.neosync_account_id, router]);

  if (isLoading) {
    return <Skeleton className="w-full h-full py-2" />;
  }

  if (!account) {
    //Back to Login Page
    router.push('/login');
  }

  return <>{children}</>;
}

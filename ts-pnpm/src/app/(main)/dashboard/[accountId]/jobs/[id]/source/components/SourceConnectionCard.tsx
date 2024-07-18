'use client';
import { useAccount } from '@/components/providers/account-provider';
import { ReactElement } from 'react';
import DataSyncConnectionCard from './DataSyncConnectionCard';
import SchemaPageSkeleton from './SchemaPageSkeleton';
import { useGetJob } from '@/lib/hooks/useGetJob';

interface Props {
  jobId: string;
}

export default function SourceConnectionCard({ jobId }: Props): ReactElement {
  const { account } = useAccount();
  const { data, isLoading } = useGetJob(account?.neosync_account_id ?? '',account?.access_token ,jobId);

  if (isLoading) {
    return <SchemaPageSkeleton />;
  }

  return <DataSyncConnectionCard jobId={jobId} />;
}

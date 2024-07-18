import { useAccount } from '@/components/providers/account-provider';
import SkeletonTable from '@/components/skeleton/SkeletonTable';

// import {
//   JobRunsAutoRefreshInterval,
//   onJobRunsAutoRefreshInterval,
//   onJobRunsPaused,
//   useGetJobRuns,
// } from '@/libs/hooks/useGetJobRuns';

import { useGetJobRuns, JobRunsAutoRefreshInterval, onJobRunsAutoRefreshInterval } from '@/lib/hooks/useGetJobRuns';

import { useGetJobs } from '@/lib/hooks/useGetJobs';
import { ReactElement, useMemo, useState } from 'react';
import { getColumns } from './JobRunsTable/columns';
import { DataTable } from './JobRunsTable/data-table';

const INTERVAL_SELECT_OPTIONS: JobRunsAutoRefreshInterval[] = [
  'off',
  '10s',
  '30s',
  '1m',
  '5m',
];

interface RunsTableProps {}

export default function RunsTable(props: RunsTableProps): ReactElement {
  const {} = props;
  const { account } = useAccount();
  const [refreshInterval, setAutoRefreshInterval] =
    useState<JobRunsAutoRefreshInterval>('1m');

    const {
      data: jobsData,
      mutate: jobsMutate,
      isLoading: isJobsLoading,
      isValidating: isJobsValidating,
    } = useGetJobs(account?.neosync_account_id ?? '', account?.access_token);
  
    const jobs = jobsData ?? [];
    
  
  const { isLoading, data, mutate, isValidating } = useGetJobRuns(
    account?.neosync_account_id ?? '', 
    account?.access_token,
    {
      refreshIntervalFn: () => onJobRunsAutoRefreshInterval(refreshInterval),
   
    }
  );

  // must be memoized otherwise it causes columns to re-render endlessly when hovering over links within the table
  const jobNameMap = useMemo(() => {
    return jobs.reduce(
      (prev, curr) => {
        return { ...prev, [curr.id]: curr.name };
      },
      {} as Record<string, string>
    );
  }, [isJobsLoading, isJobsValidating]);

  const columns = useMemo(
    () =>
      getColumns({
        onDeleted() {
          mutate();
        },
        accountId: account?.neosync_account_id ?? '',
        accountName: account?.neosync_account_id ?? '',
        jobNameMap: jobNameMap,
      }),
    [account?.id ?? '', account?.name ?? '', jobNameMap]
  );

  if (isLoading) {
    return <SkeletonTable />;
  }

  const runs = data ?? [];

  function refreshClick(): void {
    mutate();
    jobsMutate();
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={runs}
        refreshInterval={refreshInterval}
        onAutoRefreshIntervalChange={(newVal: JobRunsAutoRefreshInterval) =>
          setAutoRefreshInterval(newVal)
        }
        autoRefreshIntervalOptions={INTERVAL_SELECT_OPTIONS}
        onRefreshClick={refreshClick}
        isRefreshing={isValidating}
      />
    </div>
  );
}

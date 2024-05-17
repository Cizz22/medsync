/* eslint-disable @typescript-eslint/no-empty-function */
'use client';
import { PlusIcon } from '@radix-ui/react-icons';
import NextLink from 'next/link';
import { ReactElement, useMemo } from 'react';

import { useGetJobs } from '@/lib/hooks/useGetJobs';
import { JobStatus } from '@/lib/hooks/useGetJobStatus';
import { useGetJobStatuses } from '@/lib/hooks/useGetJobStatuses';

import ButtonText from '@/components/ButtonText';
import OverviewContainer from '@/components/containers/OverviewContainer';
import PageHeader from '@/components/headers/PageHeader';
import { useAccount } from '@/components/providers/account-provider';
import SkeletonTable from '@/components/skeleton/SkeletonTable';
import { Button } from '@/components/ui/button';

import { getColumns } from './components/DataTable/columns';
import { DataTable } from './components/DataTable/data-table';

export default function Jobs() {
    return (
        <OverviewContainer
            Header={<PageHeader header="Jobs" extraHeading={<NewJobButton />} />}
            containerClassName="jobs-page"
        >
            <div>
                <JobTable />
            </div>
        </OverviewContainer>
    );
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface JobTableProps { }

function JobTable(props: JobTableProps): ReactElement {
    // eslint-disable-next-line no-empty-pattern
    const { } = props;
    const { account } = useAccount();
    const { isLoading, data, mutate } = useGetJobs(account?.neosync_account_id, account?.access_token);
    const { data: statusData } = useGetJobStatuses(account?.neosync_account_id, account?.access_token);
    const columns = useMemo(
        () =>
            getColumns({
                accountName: account?.neosync_account_id as string,
                onDeleted() {
                    mutate();
                },
            }),
        [account?.neosync_account_id, mutate]
    );

    if (isLoading) {
        return <SkeletonTable />;
    }

    const jobs = data ?? [];
    const statusJobMap =
        statusData?.reduce(
            (prev, curr) => {
                return { ...prev, [curr.jobId]: curr.status };
            },
            {} as Record<string, JobStatus>
        ) || {};

    const jobData = jobs.map((j) => {
        return {
            ...j,
            status: statusJobMap[j.id] || JobStatus.UNSPECIFIED,
            type: j.source?.options?.config.case === 'generate' ? 'Generate' : 'Sync',
        };
    });

    return (
        <div>
            <DataTable columns={columns} data={jobData} />
        </div>
    );
}

function NewJobButton(): ReactElement {
    const { account } = useAccount();
    // const posthog = usePostHog();
    return (
        <NextLink
            href={`/${account?.name}/new/job`}
        // onClick={() => {
        //     posthog.capture('clicked_new_job_button');
        // }}
        >
            <Button onClick={() => { }}>
                <ButtonText leftIcon={<PlusIcon />} text="New Job" />
            </Button>
        </NextLink>
    );
}

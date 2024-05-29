/* eslint-disable @typescript-eslint/no-empty-function */
'use client';
import { PlusIcon } from '@radix-ui/react-icons';
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';
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
    const session = useSession()
    const { isLoading, data, mutate } = useGetJobs(session.data?.user.neosync_account_id, session.data?.user.accessToken);
    const { data: statusData } = useGetJobStatuses(session.data?.user.neosync_account_id, session.data?.user.accessToken);
    const columns = useMemo(
        () =>
            getColumns({
                accountName: session.data?.user.neosync_account_id as string,
                onDeleted() {
                    mutate();
                },
            }),
        [mutate, session.data?.user.neosync_account_id]
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
    const session = useSession()
    // const posthog = usePostHog();
    return (
        <NextLink
            href={`/dashboard/${session.data.user.neosync_account_id}/new/job`}
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

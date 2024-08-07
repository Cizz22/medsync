'use client';
import { PageProps } from '@/components/types';
import { useGetJob } from '@/lib/hooks/useGetJob';

import { useAccount } from '@/components/providers/account-provider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { useGetJobStatus } from '@/lib/hooks/useGetJobStatus';
// import { GetJobResponse } from '@neosync/sdk';
import { ReactElement } from 'react';

import ActivitySyncOptionsCard from './components/ActivitySyncOptionsCard';
import JobNextRuns from './components/NextRuns';
// import JobRecentRuns from './components/RecentRuns';
import JobScheduleCard from './components/ScheduleCard';
import WorkflowSettingsCard from './components/WorkflowSettingsCard';


import JobIdSkeletonForm from './JobIdSkeletonForm';
// import { GetJobResponse } from '@/lib/hooks/useGetJob';

export default function Page({ params }: PageProps): ReactElement {
  const id = params?.id ?? '';
  const { account } = useAccount();
  const { data, isLoading, mutate } = useGetJob(account?.neosync_account_id ?? '',account?.access_token ?? ''  ,id);
  const { data: jobStatus } = useGetJobStatus(account?.neosync_account_id ?? '', account?.access_token, id);
  
  if (isLoading) {
    return (
      <div className="pt-10">
        <JobIdSkeletonForm />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mt-10">
        <Alert variant="destructive">
          <AlertTitle>{`Error: Unable to retrieve job`}</AlertTitle>
        </Alert>
      </div>
    );
  }

  return (
    <div className="job-details-container">
      <div className="flex flex-col gap-5">
        <div className="flex flex-row gap-5">
          <div className="flex-grow basis-3/4">
            <JobScheduleCard
              job={data}
              mutate={(newjob) => mutate( newjob )}
            />
          </div>
          <div className="flex-grow basis-1/4 overflow-y-auto rounded-xl border border-card-border">
            <JobNextRuns jobId={id} status={jobStatus} />
          </div>
        </div>
        
        {/* <JobRecentRuns jobId={id} /> */}
       
        {/* <Accordion type="single" collapsible>
          <AccordionItem value="advanced-settings">
            <AccordionTrigger className="-ml-2">
              <div className="hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg">
                Advanced Settings
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-3">
                <div>
                  <WorkflowSettingsCard
                    job={data}
                    mutate={(newjob) =>
                      mutate(newjob )
                    }
                  />
                </div>
                <div>
                  <ActivitySyncOptionsCard
                    job={data}
                    mutate={(newjob) =>
                      mutate(newjob)
                    }
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion> */}
      </div>
    </div>
  );
}

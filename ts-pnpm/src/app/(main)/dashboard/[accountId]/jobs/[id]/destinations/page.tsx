'use client';
import ButtonText from '@/components/ButtonText';
import SubPageHeader from '@/components/headers/SubPageHeader';
import { useAccount } from '@/components/providers/account-provider';
import { PageProps } from '@/components/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
// import { useGetConnections } from '@/libs/hooks/useGetConnections';
// import { useGetJob } from '@/libs/hooks/useGetJob';
import { PlusIcon } from '@radix-ui/react-icons';
import NextLink from 'next/link';
import { ReactElement } from 'react';
// import {
//   getConnectionIdFromSource,
//   getFkIdFromGenerateSource,
// } from '../source/components/util';
// import { isAiDataGenJob, isDataGenJob } from '../../../app/(main)/dashboard/[accountId]/jobs/[id]/util';
import DestinationConnectionCard from './components/DestinationConnectionCard';
import { useGetJob } from '@/lib/hooks/useGetJob';
import { useGetConnections } from '@/lib/hooks/useGetConnections';

export default function Page({ params }: PageProps): ReactElement {
  const id = params?.id ?? '';
  const { account } = useAccount();
  const { data, isLoading, mutate } = useGetJob(account?.neosync_account_id ?? '',account?.access_token ,id);
  const { isLoading: isConnectionsLoading, data: connectionsData } =
    useGetConnections(account?.neosync_account_id ?? '', account?.access_token);

  const connections = connectionsData ?? [];

  const destinationIds = new Set(
    data?.destinations.map((d) => d.connectionId)
  );

  // const sourceConnectionId = getConnectionIdFromSource(data?.source);
  // const fkConnectionId = getFkIdFromGenerateSource(data?.source);
  // const fkConnection = connections.find((c) => c.id === fkConnectionId);
  
  return (
    <div className="job-details-container">
      <SubPageHeader
        header="Destination Connections"
        description={`Manage a job's destination connections`}
        extraHeading={
            <NewDestinationButton jobId={id} />

        }
      />

      {isLoading || isConnectionsLoading ? (
        <Skeleton className="w-full h-96 rounded-lg" />
      ) : (
        <div className="space-y-10">
          {/* {data?.destinations.map((destination) => {
            return (
              // <DestinationConnectionCard
              //   key={destination.id}
              //   jobSourceId={
              //     fkConnectionId
              //       ? fkConnectionId
              //       : sourceConnectionId
              //         ? sourceConnectionId
              //         : ''
              //   }
              //   jobId={id}
              //   destination={destination}
              //   mutate={mutate}
              //   connections={connections}
              //   availableConnections={connections.filter((c) => {
              //     // if (isDataGenJob(data?.job) || isAiDataGenJob(data?.job)) {
              //     //   return (
              //     //     c.connectionConfig?.config.case ===
              //     //     fkConnection?.connectionConfig?.config.case
              //     //   );
              //     // }
              //     return (
              //       c.id === destination.connectionId ||
              //       (c.id != sourceConnectionId && !destinationIds?.has(c.id))
              //     );
              //   })}
              //   isDeleteDisabled={data?.destinations.length === 1}
              // />
            );
          })} */}
        </div>
      )}
    </div>
  );
}

interface NewDestinationButtonProps {
  jobId: string;
}

function NewDestinationButton(props: NewDestinationButtonProps): ReactElement {
  const { jobId } = props;
  const { account } = useAccount();
  return (
    <NextLink href={`/dashboard/${account?.neosync_account_id}/new/job/${jobId}/destination`}>
      <Button>
        <ButtonText leftIcon={<PlusIcon />} text="New Destination" />
      </Button>
    </NextLink>
  );
}

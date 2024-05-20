'use client';
import { useRouter, useSearchParams } from 'next/navigation';

import ConnectionIcon from '@/components/connections/ConnectionIcon';
import { useAccount } from '@/components/providers/account-provider';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export interface ConnectionMeta {
  name: string;
  description: string;
  urlSlug: string;
}

interface Props {
  connection: ConnectionMeta;
}

export default function ConnectionCard(props: Props) {
  const { connection } = props;
  const router = useRouter();
  const { account } = useAccount();
  const searchParams = useSearchParams();
  return (
    <Card
      onClick={() =>
        router.push(
          `/${account?.name}/new/connection/${connection.urlSlug
          }?${searchParams.toString()}`
        )
      }
      className="cursor-pointer hover:border hover:border-gray-500 dark:border-gray-700 dark:hover:border-gray-600"
    >
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row items-center space-x-2">
            <ConnectionIcon name={connection.name} />
            <p>{connection.name}</p>
          </div>
        </CardTitle>
        <CardDescription>{connection.description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

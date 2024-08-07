'use client';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';

import { ConnectionResponse } from '@/lib/hooks/useGetConnection';
import { getErrorMessage } from '@/lib/utils';

import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { useAccount } from '@/components/providers/account-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onDeleted(): void;
}

export function DataTableRowActions<TData>({
  row,
  onDeleted,
}: DataTableRowActionsProps<TData>) {
  const connection = row.original as ConnectionResponse;
  const router = useRouter();
  const { account } = useAccount();
  const { toast } = useToast();

  async function onDelete(): Promise<void> {
    try {
      await removeConnection(account?.neosync_account_id ?? '', connection.id, account?.access_token ?? '');
      toast({
        title: 'Connection removed successfully!',
        variant: 'default',
      });
      onDeleted();
    } catch (err) {
      toast({
        title: 'Unable to remove connection',
        description: getErrorMessage(err),
        variant: 'destructive',
      });
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() =>
            router.push(`/dashboard/${account?.neosync_account_id}/connections/${connection.id}`)
          }
        >
          View
        </DropdownMenuItem>
        {/* <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() =>
            router.push(
              `/dashboard/${account?.neosync_account_id}/new/connection/${getConnectionType(connection.connectionConfig?.config.case ?? '')}?sourceId=${connection.id}`
            )
          }
        >
          Clone
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DeleteConfirmationDialog
          trigger={
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={(e) => e.preventDefault()}
            >
              Delete
            </DropdownMenuItem>
          }
          headerText="Are you sure you want to delete this connection?"
          description="Deleting this connection is irreversable!"
          onConfirm={async () => onDelete()}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

async function removeConnection(
  accountId: string,
  connectionId: string,
  accessToken: string
): Promise<void> {
  if (!accessToken || !accountId || !connectionId) {
    throw new Error('Invalid parameters');
  }

   await fetch(
    `/api/accounts/${accountId}/connections/${connectionId}`,
    {
      method: 'DELETE',
      headers: {
        'token': accessToken
      }
    }
  );
  // if (!res.ok) {
  //   const body = await res.json();
  //   throw new Error(body.message);
  // }
}

export function getConnectionType(connType: string): string {
  switch (connType) {
    case 'pgConfig':
      return 'postgres';
    case 'mysqlConfig':
      return 'mysql';
    case 'awsS3Config':
      return 'aws-s3';
    default:
      return 'postgres';
  }
}

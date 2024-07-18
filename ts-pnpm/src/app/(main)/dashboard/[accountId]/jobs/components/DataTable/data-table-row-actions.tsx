'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';

import { GetJobResponse } from '@/lib/hooks/useGetJob';
import { getErrorMessage } from '@/lib/utils';

import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { useAccount } from '@/components/providers/account-provider';
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
  const job = row.original as GetJobResponse;
  const router = useRouter();
  const { account } = useAccount();

  const { toast } = useToast();

  async function onDelete(): Promise<void> {
    try {
      await removeJob(account?.neosync_account_id, job.id, account?.access_token);
      toast({
        title: 'Job removed successfully!',
        variant: 'default',
      });
      onDeleted();
    } catch (err) {
      toast({
        title: 'Unable to remove job',
        description: getErrorMessage(err),
        variant: 'destructive',
      });
    }
  }

  return (
    <DropdownMenu
      modal={false} // needed because otherwise this breaks after a single use in conjunction with the delete dialog
    >
      <DropdownMenuTrigger className="hover:bg-gray-100 dark:hover:bg-gray-800 py-1 px-2 rounded-lg">
        <DotsHorizontalIcon className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push(`/dashboard/${account?.neosync_account_id}/jobs/${job.id}`)}
        >
          View
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteConfirmationDialog
          trigger={
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={(e) => e.preventDefault()} // needed for the delete modal to not automatically close
            >
              Delete
            </DropdownMenuItem>
          }
          headerText="Are you sure you want to delete this job?"
          description="Deleting this job will also delete all job runs."
          onConfirm={() => onDelete()}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

async function removeJob(accountId: string | undefined, jobId: string, access_token: string | undefined): Promise<void> {
  if (!accountId || !jobId || !access_token) {
    throw new Error('Invalid account or job');
  }
  const res = await fetch(`/api/accounts/${accountId}/jobs/${jobId}`, {
    method: 'DELETE',
    headers: {
      'token': access_token
    }
  });
  // if (!res.ok) {
  //   const body = await res.json();
  //   throw new Error(body.message);
  // }
  await res.json();
}

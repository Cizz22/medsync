import ButtonText from '@/components/ButtonText';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { useAccount } from '@/components/providers/account-provider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getErrorMessage } from '@/lib/utils';
import { TrashIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { ReactElement } from 'react';

interface Props {
  connectionId: string;
}

export default function RemoveConnectionButton(props: Props): ReactElement {
  const { connectionId } = props;
  const router = useRouter();
  const account = useAccount();
  const { toast } = useToast();

  async function onDelete(): Promise<void> {
    try {
      await removeConnection(account.account?.neosync_account_id ?? '',connectionId ,account.account?.access_token ?? '' );
      toast({
        title: 'Successfully removed connection!',
        variant: 'default',
      });
      router.push(`/${account.account?.neosync_account_id}/connections`);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Unable to remove connection',
        description: getErrorMessage(err),
        variant: 'destructive',
      });
    }
  }

  return (
    <DeleteConfirmationDialog
      trigger={
        <Button variant="destructive">
          <ButtonText leftIcon={<TrashIcon />} text="Delete Connection" />
        </Button>
      }
      headerText="Are you sure you want to delete this connection?"
      description="Deleting this connection is irreversable!"
      onConfirm={async () => onDelete()}
    />
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

  const res = await fetch(
    `/api/accounts/${accountId}/connections/${connectionId}`,
    {
      method: 'DELETE',
      headers: {
        'token': accessToken
      }
    }
  );
}

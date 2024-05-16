import { HookReply } from './types';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';

interface UserAccountResponse {
  id: number,
  email: string
  neosync_account_id: string
  name: string
}

export function useGetUserAccounts(token: string | undefined): HookReply<UserAccountResponse> {
  return useAuthenticatedFetch(
    `/api/users/whoami`,
    !!token,
    token
  );
}

import { HookReply } from './types';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';

export function useGetUserAccounts(token: string): HookReply<JSON> {
  return useAuthenticatedFetch<JSON>(
    `/api/users/accounts`,
    token,
    true,
    undefined,
  );
}

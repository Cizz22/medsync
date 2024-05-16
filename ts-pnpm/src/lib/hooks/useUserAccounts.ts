import { useAuthenticatedFetch } from './useAuthenticatedFetch';

interface UserAccountResponse {
  
}

export function useGetUserAccounts(token: string | undefined) {
  return useAuthenticatedFetch(
    `/api/users/whoami`,
    !!token,
    token
  );
}

import { HookReply } from './types';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';


export interface GetConnectionPrimaryConstraintsResponse{
    [key:string]:PrimaryConstrains
}
export interface PrimaryConstrains{
    columns:string[]
}

export function useGetConnectionPrimaryConstraints(
  accountId: string,
  connectionId: string,
  token: string
): HookReply<GetConnectionPrimaryConstraintsResponse> {
  return useAuthenticatedFetch(
    `/api/accounts/${accountId}/connections/${connectionId}/constrains/primary`,
    !!accountId && !!connectionId,
    token
  );
}

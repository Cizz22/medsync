// import { GetConnectionForeignConstraintsResponse } from '@neosync/sdk';

import { HookReply } from './types';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';


interface GetConnectionForeignConstraintsResponse {
  foreignConstraints: 
}

export function useGetConnectionForeignConstraints(
  accountId: string,
  connectionId: string,
  token: string
): HookReply<GetConnectionForeignConstraintsResponse> {
  return useAuthenticatedFetch(
    `api/accounts/${accountId}/connections/${connectionId}/constraints/foreign`,
    !!accountId && !!connectionId,
    token
  )
}

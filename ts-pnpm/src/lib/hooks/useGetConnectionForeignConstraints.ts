// import { GetConnectionForeignConstraintsResponse } from '@neosync/sdk';

import { HookReply } from './types';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';


export interface GetConnectionForeignConstraintsResponse {
    [key:string]:ForeignConstrainsTable
}

export interface ForeignConstrainsTable{
    constraints:ForeignConstrains[]
}

export interface ForeignConstrains {
    column: string,
    isNullable: boolean,
    foreignKey: ForeignKey
}
export interface ForeignKey {
  table:string,
  column:string
}

export function useGetConnectionForeignConstraints(
  accountId: string,
  connectionId: string,
  token: string
): HookReply<GetConnectionForeignConstraintsResponse> {
  return useAuthenticatedFetch(
    `/api/accounts/${accountId}/connections/${connectionId}/constrains/foreign`,
    !!accountId && !!connectionId,
    token
  )
}

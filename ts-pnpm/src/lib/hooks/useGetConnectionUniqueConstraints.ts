// import { JsonValue } from '@bufbuild/protobuf';
// import { GetConnectionUniqueConstraintsResponse } from '@neosync/sdk';
import { HookReply } from './types';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';

export interface GetConnectionUniqueConstraintsResponse {
  [key:string]: UniqueConstraints
}

export interface UniqueConstraints{
  columns:string[]
}


export function useGetConnectionUniqueConstraints(
  accountId: string,
  token:string,
  connectionId: string
): HookReply<GetConnectionUniqueConstraintsResponse> {
  return useAuthenticatedFetch(
    `/api/accounts/${accountId}/connections/${connectionId}/constrains/unique`,
    !!accountId && !!connectionId,
    token
  );
}

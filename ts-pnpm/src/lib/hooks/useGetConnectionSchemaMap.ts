// import { PlainMessage } from '@bufbuild/protobuf';
// import { DatabaseColumn } from '@neosync/sdk';
import { HookReply } from './types';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';


export interface GetConnectionSchemaMapResponse {
  [key:string]: DatabaseColumn[]
}

export type ConnectionSchemaMap = Record<
  string,
  DatabaseColumn[]
>;


export interface DatabaseColumn{
    schema: string,
    table: string,
    column: string,
    dataType: string,
    isNullable: string,
    column_default?:string,
    generated_type?:string
}

export function useGetConnectionSchemaMap(
  accountId: string,
  token:string,
  connectionId?: string
): HookReply<GetConnectionSchemaMapResponse> {
  return useAuthenticatedFetch(
    `/api/accounts/${accountId}/connections/${connectionId}/schema`,
    !!accountId && !!connectionId,
    token
  );
}


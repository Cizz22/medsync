// import { JsonValue } from '@bufbuild/protobuf';
// import { GetSystemTransformersResponse } from '@neosync/sdk';
import { HookReply } from './types';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';
import { TransformerDataType, TransformerSource } from './useGetSystemTransformers';
// import { useNucleusAuthenticatedFetch } from './useNucleusAuthenticatedFetch';

export interface TransformerConfig{
  case:string,
  value:any
}


export interface CreateUserDefinedTransformerResponse{
  id:string,
  name:string,
  description:string,
  dataType:TransformerDataType
  source:TransformerSource
  config:TransformerConfig,
  createdAt:string,
  updatedAt:string,
  accountId:string,
  dataTypes:TransformerDataType[]
}

export function useGetUserDefinedTransformers(
  accountId: string,
  token:string
): HookReply<Array<CreateUserDefinedTransformerResponse>> {
  return useAuthenticatedFetch(
    `/api/accounts/${accountId}/transformers/user-defined`,
    !!accountId,
    token,
  );
}

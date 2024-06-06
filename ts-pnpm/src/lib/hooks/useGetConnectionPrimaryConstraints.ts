// import { JsonValue } from '@bufbuild/protobuf';
// import { GetConnectionPrimaryConstraintsResponse } from '@neosync/sdk';

// import { HookReply } from './types';
// import { useAuthenticatedFetch } from './useAuthenticatedFetch';


// export function useGetConnectionPrimaryConstraints(
//   accountId: string,
//   connectionId: string,
//   token: string
// ): HookReply<GetConnectionPrimaryConstraintsResponse> {
//   return useAuthenticatedFetch(
//     `/api/accounts/${accountId}/connections/${connectionId}/primary-constraints`,
//     !!accountId && !!connectionId,
//     token
//   );
// }

import { HookReply } from './types';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';
import { GetJobResponse } from './useGetJob';


export function useGetJobs(accountId: string | undefined, token: string | undefined): HookReply<Array<GetJobResponse>> {
    return useAuthenticatedFetch(
        `/api/accounts/${accountId}/jobs`,
        !!accountId && !!token,
        token
    )
}

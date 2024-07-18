import { HookReply } from "./types";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { JobStatusResponse } from "./useGetJobStatus";


interface JobStatusesResponse{
    statuses: JobStatusResponse[]
}

export function useGetJobStatuses(accountId: string | undefined, token: string | undefined): HookReply<JobStatusesResponse> {
    return useAuthenticatedFetch(
        `/api/accounts/${accountId}/jobs/statuses`,
        !!accountId && !!token,
        token
    )
}
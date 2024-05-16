import { HookReply } from "./types";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { JobStatusResponse } from "./useGetJobStatus";

export function useGetJobStatuses(accountId: string | undefined, token: string | undefined): HookReply<Array<JobStatusResponse>> {
    return useAuthenticatedFetch(
        `/api/accounts/${accountId}/jobs/statuses`,
        !!accountId && !!token,
        token
    )
}
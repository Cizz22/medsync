import { HookReply } from "./types";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { JobRunResponse } from "./useGetJobRun";

export function useGetJobRunsbyJob(accountId: string | undefined, token: string | undefined, JobId:string): HookReply<Array<JobRunResponse>> {
    return useAuthenticatedFetch(
        `/api/accounts/${accountId}/runs?jobId=${JobId}`,
        !!accountId && !!token,
        token
    )
}
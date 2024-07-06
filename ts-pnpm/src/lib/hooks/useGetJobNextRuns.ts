import { HookReply } from "./types";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { JobRunResponse } from "./useGetJobRuns";

export interface JobNextRuns{
    nextRunTimes:string[]
}

export function useGetJobNextRuns(accountId: string | undefined, token: string | undefined, JobId:string): HookReply<JobNextRuns> {
    return useAuthenticatedFetch(
        `/api/accounts/${accountId}/jobs/${JobId}/next-run`,
        !!accountId && !!token,
        token
    )
}
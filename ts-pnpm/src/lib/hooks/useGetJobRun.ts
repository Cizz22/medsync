import { HookReply } from "./types";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { JobStatusResponse } from "./useGetJobStatus";

export enum ActivityStatus{
    ACTIVITY_STATUS_UNSPECIFIED = 0,
    ACTIVITY_STATUS_SCHEDULED=1,
    ACTIVITY_STATUS_STARTED=2,
    ACTIVITY_STATUS_CANCELED=3,
    ACTIVITY_STATUS_FAILED=4
}

export interface PendingActivity{
    status:ActivityStatus,
    activityName:string,
    lastFailure?:{
        message:string
    }
}

export interface JobRunResponse{
    id:string,
    jobId:string,
    name:string,
    status:string,
    startedAt:string,
    completedAt:string,
    pendingActivities:PendingActivity[]
}

export function useGetJobRunsbyJob(accountId: string | undefined, token: string | undefined, JobId:string): HookReply<Array<JobRunResponse>> {
    return useAuthenticatedFetch(
        `/api/accounts/${accountId}/runs/${JobId}`,
        !!accountId && !!token,
        token
    )
}
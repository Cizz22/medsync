import { HookReply } from './types';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';


export enum JobStatus {
    UNSPECIFIED = "JOB_STATUS_UNSPECIFIED",
    ENABLED = "JOB_STATUS_ENABLED",
    PAUSED = "JOB_STATUS_PAUSED",
    DISABLED = "JOB_STATUS_DISABLED"
}

export interface JobStatusResponse {
    jobId: string;
    status: JobStatus;
}

export function useGetJobStatus(accountId: string | undefined, token: string | undefined, jobId:string): HookReply<JobStatusResponse> {
    return useAuthenticatedFetch(
        `/api/accounts/${accountId}/jobs/${jobId}/status`,
        !!accountId && !!token,
        token
    )
}
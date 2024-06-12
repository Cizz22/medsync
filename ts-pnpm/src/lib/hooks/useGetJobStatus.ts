import { HookReply } from './types';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';


export enum JobStatus {
    UNSPECIFIED = 0,
    ENABLED = 1,
    PAUSED = 2,
    DISABLED = 3
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
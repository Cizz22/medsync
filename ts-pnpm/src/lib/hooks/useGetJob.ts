import { HookReply } from './types';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';


export interface GetJobResponse {
    id:string,
    createdByUserId:string,
    createdAt:string,
    updatedByUserId:string,
    updatedAt:string,
    name:string,
    source: any,
    destinations:Array<any>,
    mappings:any
    cronSchedule:string
    accountId:string
    syncOptions:any
    workflowOptions:any
}

export function useGetJob(accountId: string | undefined, token: string | undefined, jobId:string): HookReply<GetJobResponse> {
    return useAuthenticatedFetch(
        `/api/accounts/${accountId}/jobs/${jobId}`,
        !!accountId && !!token,
        token
    )
}
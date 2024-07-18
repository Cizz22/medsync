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

export type JobRunsAutoRefreshInterval = 'off' | '10s' | '30s' | '1m' | '5m';

export interface GetJobRunsOptions {
  refreshIntervalFn?(data:any): number;
  isPaused?(): boolean;
}

export function onJobRunsAutoRefreshInterval(
    interval: JobRunsAutoRefreshInterval
  ): number {
    switch (interval) {
      case 'off':
        return 0;
      case '10s':
        return 10 * 1000;
      case '30s':
        return 30 * 1000;
      case '1m':
        return 1 * 60 * 1000;
      case '5m':
        return 5 * 60 * 1000;
      default:
        return 0;
    }
  }
  
  export function onJobRunsPaused(interval: JobRunsAutoRefreshInterval): boolean {
    return interval === 'off';
  }
  

export interface JobRunResponse{
    id:string,
    jobId:string,
    jobName:string,
    status:JobRunStatus,
    startedAt:string,
    completedAt:string,
    pendingActivities:PendingActivity[]
}


export function getRefreshIntervalFn<T>(
  fn?: (data: T) => number
): ((data: T | undefined) => number) | undefined {
  if (!fn) {
    return undefined;
  }
  return (data) => {
    if (!data) {
      return 0;
    }
    return fn(data);
  };
}

export enum JobRunStatus {
  UNSPECIFIED = "JOB_RUN_STATUS_UNSPECIFIED",        // if the job run status is unknown
  PENDING = "JOB_RUN_STATUS_PENDING",            // the run is pending and has not started yet
  RUNNING = "JOB_RUN_STATUS_RUNNING",            // the run is currently in progress
  COMPLETE = "JOB_RUN_STATUS_COMPLETE",           // the run has successfully completed
  ERROR = "JOB_RUN_STATUS_ERROR",              // the run ended with an error
  CANCELED = "JOB_RUN_STATUS_CANCELED",           // the run was cancelled
  TERMINATED = "JOB_RUN_STATUS_TERMINATED",         // the run was terminated
  FAILED = "JOB_RUN_STATUS_FAILED",             // the run ended in failure
  TIMED_OUT = "JOB_RUN_STATUS_TIMED_OUT"           // the run was ended prematurely due to timeout
}

export function useGetJobRuns(
  accountId: string | undefined, 
  token: string | undefined,
  opts: GetJobRunsOptions = {},
  jobId?: string | undefined
): HookReply<Array<JobRunResponse>> {
  const { refreshIntervalFn, isPaused } = opts;
  const fetchUrl = jobId ? `/api/accounts/${accountId}/runs?jobId=${jobId}` : `/api/accounts/${accountId}/runs`
    return useAuthenticatedFetch(
        fetchUrl,
        !!accountId && !!token,
        token,
        {
          refreshInterval: getRefreshIntervalFn(refreshIntervalFn),
          isPaused: isPaused ?? (() => false),
        },
    )
}
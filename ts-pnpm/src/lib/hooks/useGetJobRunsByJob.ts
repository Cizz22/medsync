import { HookReply } from "./types";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { JobRunResponse, JobRunStatus } from "./useGetJobRuns";
import { getRefreshIntervalFn } from "../utils";

interface GetJobRunOptions {
    refreshIntervalFn?(data: any): number;
  }

export function useGetJobRunsbyJob(accountId: string | undefined, token: string | undefined, jobId:string,  opts: GetJobRunOptions = {}): HookReply<Array<JobRunResponse>> {
    const { refreshIntervalFn } = opts;
    return useAuthenticatedFetch(
        `/api/accounts/${accountId}/runs?jobId=${jobId}`,
        !!accountId && !!token,
        token,
        {
            refreshInterval: getRefreshIntervalFn(refreshIntervalFn),
          },
    )
}

const TEN_SECONDS = 10 * 1000;

export function refreshWhenJobRunning(data: JobRunResponse): number {
  const jobRun = data;
  if (!jobRun || !jobRun.status) {
    return 0;
  }
  return shouldRefreshJobRun(jobRun.status) ? TEN_SECONDS : 0;
}

function shouldRefreshJobRun(status?: JobRunStatus): boolean {
  return (
    status === JobRunStatus.RUNNING ||
    status === JobRunStatus.PENDING ||
    status === JobRunStatus.ERROR
  );
}

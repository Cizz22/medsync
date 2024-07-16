import { HookReply } from "./types";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { JobRunResponse, JobRunStatus } from "./useGetJobRuns";
import { getRefreshIntervalFn } from "../utils";

interface GetJobRunOptions {
    refreshIntervalFn?(data: any): number;
  }

export function useGetJobRun(accountId: string | undefined, token: string | undefined, runId:string,  opts: GetJobRunOptions = {},): HookReply<JobRunResponse> {
    const { refreshIntervalFn } = opts;
    return useAuthenticatedFetch(
        `/api/accounts/${accountId}/runs/${runId}`,
        !!accountId && !!token,
        token,
        {
            refreshInterval: getRefreshIntervalFn(refreshIntervalFn),
          },
    )
}

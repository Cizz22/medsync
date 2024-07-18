import { getRefreshIntervalFn } from '../utils';
import { HookReply } from './types';
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";

interface GetJobRunLogsOptions {
  refreshIntervalFn?(data: any): number;
}

export enum LogLevel {
  UNSPECIFIED = "LOG_LEVEL_UNSPECIFIED",  // unspecified log level
  DEBUG = "LOG_LEVEL_DEBUG",              // debug-level messages
  INFO = "LOG_LEVEL_INFO",                // informational messages
  WARN = "LOG_LEVEL_WARN",                // warning messages
  ERROR = "LOG_LEVEL_ERROR"               // error messages
}

export interface GetJobRunLogsStreamResponse{
  logLine:string, 
  timestamp:string
}

export function useGetJobRunLogs(
  runId: string,
  accountId: string,
  token:string,
  loglevel: LogLevel,
  opts: GetJobRunLogsOptions = {}
): HookReply<GetJobRunLogsStreamResponse[]> {
  const { refreshIntervalFn } = opts;

  const query = new URLSearchParams({
    loglevel: loglevel.toString(),
  });

  return useAuthenticatedFetch(
    `/api/accounts/${accountId}/runs/${runId}/logs?${query.toString()}`,
    !!runId || !!accountId,
    token,
    {
      refreshInterval: getRefreshIntervalFn(refreshIntervalFn),
    },
  );
}

const TEN_SECONDS = 5 * 1000;

export function refreshLogsWhenRunNotComplete(data: GetJobRunLogsStreamResponse): number {
  const dataArr = Array.isArray(data) ? data : [data];
  return dataArr.some((d) => {
    return (
      data.logLine.includes('context canceled') ||
      data.logLine.includes('workflow completed')
    );
  })
    ? 0
    : TEN_SECONDS;
}

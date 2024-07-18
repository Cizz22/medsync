import { getRefreshIntervalFn } from '../utils';
import { HookReply } from './types';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';

interface GetJobRunEventsOptions {
  refreshIntervalFn?(data: any): number;
}

export interface JobRunEvent{
  id: number,
  type:string,
  startTime:string,
  closeTime:string,
  metadata:JobRunEventMetadata,
  tasks:{
    id:number,
    type:number,
    eventTime:string,
    error:JobRunEventTaskError
  }[]
}

export interface JobRunEventMetadata{
  syncMetadata:{
    schema:string,
    table:string
  }
}

export interface JobRunEventTaskError{
  message:string,
      retryState:string
}

export interface GetJobRunEventsResponse{
  events: JobRunEvent[],
  isRunComplete:boolean
}

export function useGetJobRunEvents(
  runId: string,
  accountId: string,
  token:string,
  opts: GetJobRunEventsOptions = {}
): HookReply<GetJobRunEventsResponse> {
  const { refreshIntervalFn } = opts;
  return useAuthenticatedFetch
  (
    `/api/accounts/${accountId}/runs/${runId}/events`,
    !!runId || !!accountId,
    token,
    {
      refreshInterval: getRefreshIntervalFn(refreshIntervalFn),
    },
  )
}

const TEN_SECONDS = 10 * 1000;

export function refreshEventsWhenEventsIncomplete(data:GetJobRunEventsResponse): number {
  const response = data;
  const { isRunComplete } = response;
  return isRunComplete ? 0 : TEN_SECONDS;
}

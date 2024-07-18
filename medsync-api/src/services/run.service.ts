import {
  CancelJobRunRequest,
  GetJobRunEventsRequest,
  GetJobRunLogsStreamRequest,
  GetJobRunLogsStreamResponse,
  GetJobRunRequest,
  GetJobRunsRequest,
  LogWindow,
  TerminateJobRunRequest,
  LogLevel
} from '@neosync/sdk';
import { getNeosyncContext } from '../config/neosync';

const client = getNeosyncContext();

export async function getRuns(accountId: string, jobId?: string) {
  const getJobRunReq = jobId
    ? new GetJobRunsRequest({ id: { value: jobId, case: 'jobId' } })
    : new GetJobRunsRequest({
        id: { value: accountId, case: 'accountId' }
      });

  const jobRuns = await client.jobs.getJobRuns(getJobRunReq);

  return jobRuns.jobRuns;
}

export async function getRun(accountId: string, runId: string) {
  const jobRun = await client.jobs.getJobRun(
    new GetJobRunRequest({
      jobRunId: runId,
      accountId
    })
  );

  return jobRun.jobRun;
}

export async function deleteRun(accountId: string, runId: string) {
  await client.jobs.deleteJobRun(
    new GetJobRunRequest({
      jobRunId: runId,
      accountId
    })
  );
}

export async function cancelRun(accountId: string, runId: string) {
  await client.jobs.cancelJobRun(
    new CancelJobRunRequest({
      jobRunId: runId,
      accountId
    })
  );
}
export async function getJobRunEvents(accountId: string, runId: string) {
  const jobEvents = await client.jobs.getJobRunEvents(
    new GetJobRunEventsRequest({
      jobRunId: runId,
      accountId
    })
  );

  return jobEvents;
}

export async function getJobRunLogs(accountId: string, runId: string, logLevel: any) {
  const response = client.jobs.getJobRunLogsStream(
    new GetJobRunLogsStreamRequest({
      jobRunId: runId,
      accountId: accountId,
      window: getWindow('1d'),
      shouldTail: false,
      maxLogLines: BigInt('5000'),
      logLevels: [LogLevel.UNSPECIFIED]
    })
  );

  const logs: GetJobRunLogsStreamResponse[] = [];
  for await (const logRes of response) {
    logs.push(logRes);
  }
  return logs;
}

export async function terminateRun(accountId: string, runId: string) {
  await client.jobs.terminateJobRun(
    new TerminateJobRunRequest({
      jobRunId: runId,
      accountId
    })
  );

  return true;
}

export default {
  getRuns,
  getRun,
  deleteRun,
  cancelRun,
  getJobRunEvents,
  getJobRunLogs,
  terminateRun
};

function getWindow(window?: string): LogWindow {
  if (!window) {
    return LogWindow.NO_TIME_UNSPECIFIED;
  }
  if (window === '15m' || window === '15min') {
    return LogWindow.FIFTEEN_MIN;
  }
  if (window === '1h') {
    return LogWindow.ONE_HOUR;
  }
  if (window === '1d') {
    return LogWindow.ONE_DAY;
  }
  return LogWindow.NO_TIME_UNSPECIFIED;
}

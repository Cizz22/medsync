import {
  ActivityOptions,
  Connection,
  CreateJobRequest,
  CreateJobRunRequest,
  GetJobNextRunsRequest,
  GetJobRecentRunsRequest,
  GetJobRequest,
  GetJobStatusRequest,
  GetJobsRequest,
  IsJobNameAvailableRequest,
  JobDestination,
  JobMapping,
  JobSource,
  PauseJobRequest,
  RetryPolicy,
  WorkflowOptions
} from '@neosync/sdk';
import { getNeosyncContext } from '../config/neosync';
import connectionService from './connection.service';
import { convertMinutesToNanoseconds } from '../utils/utils';
import { toJobDestinationOption, toJobSourceOption } from '../utils/connectionConfig';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

const client = getNeosyncContext();

export async function getJobs(
  accountId: string
  // filter: object,
  // options: { limit?: number; page?: number; sortBy?: string; sortType?: 'asc' | 'desc' }
) {
  // const page = options.page || 1;
  // const limit = options.limit || 10;
  // const sortBy = options.sortBy || 'createdAt';
  // const sortType = options.sortType || 'desc';

  const result = await client.jobs.getJobs(
    new GetJobsRequest({
      accountId
    })
  );

  return result.jobs;
}

export async function createJob(accountId: string, req: any) {
  //const sourceConnection = await connectionService.getConnection(accountId, source.connectionId);
  const { define, connect, schema, subset } = req;

  const connections = await connectionService.getConnections(accountId);

  const sourceConnection = connections.find((connection) => connection.id === connect.sourceId);

  let workflowOptions: WorkflowOptions | undefined = undefined;
  if (define.workflowSettings?.runTimeout) {
    workflowOptions = new WorkflowOptions({
      runTimeout: convertMinutesToNanoseconds(define.workflowSettings.runTimeout)
    });
  }
  let syncOptions: ActivityOptions | undefined = undefined;
  if (define.syncActivityOptions) {
    const formSyncOpts = define.syncActivityOptions;
    syncOptions = new ActivityOptions({
      scheduleToCloseTimeout:
        formSyncOpts.scheduleToCloseTimeout !== undefined
          ? convertMinutesToNanoseconds(formSyncOpts.scheduleToCloseTimeout)
          : undefined,
      startToCloseTimeout:
        formSyncOpts.startToCloseTimeout !== undefined
          ? convertMinutesToNanoseconds(formSyncOpts.startToCloseTimeout)
          : undefined,
      retryPolicy: new RetryPolicy({
        maximumAttempts: formSyncOpts.retryPolicy?.maximumAttempts
      })
    });
  }

  const data = new CreateJobRequest({
    accountId,
    jobName: define.jobName,
    cronSchedule: define.cronSchedule,
    initiateJobRun: define.initiateJobRun,
    mappings: schema.mappings.map((mapping: any) => {
      return new JobMapping({
        schema: mapping.schema,
        table: mapping.table,
        column: mapping.column,
        transformer: undefined
      });
    }),
    source: new JobSource({
      options: toJobSourceOption(connect, subset, sourceConnection)
    }),
    destinations: connect.destinations.map((destination: any) => {
      return new JobDestination({
        connectionId: destination.connectionId,
        options: toJobDestinationOption(
          destination.destinationOptions,
          connections.find((connection) => connection.id === destination.connectionId)
        )
      });
    }),
    workflowOptions: workflowOptions,
    syncOptions: syncOptions
  });

  console.log(data);

  const job = await client.jobs.createJob(data);

  return job.job;
}

export async function getJobStatuses(accountId: string) {
  const result = await client.jobs.getJobStatuses(
    new GetJobsRequest({
      accountId
    })
  );

  return result.statuses;
}

export async function isJobNameAvailable(accountId: string, name: string) {
  const is_available = await client.jobs.isJobNameAvailable(
    new IsJobNameAvailableRequest(
      new IsJobNameAvailableRequest({
        name,
        accountId
      })
    )
  );

  return is_available.isAvailable;
}

export async function getJob(accountId: string, jobId: string) {
  const job = await client.jobs.getJob(
    new GetJobRequest({
      id: jobId
    })
  );

  if (job.job?.accountId !== accountId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }

  return job.job;
}

export async function deleteJob(accountId: string, jobId: string) {
  const job = await client.jobs.deleteJob(
    new GetJobRequest({
      id: jobId
    })
  );

  return job;
}

export async function createJobRun(JobId: string) {
  const jobRun = await client.jobs.createJobRun(
    new CreateJobRunRequest({
      jobId: JobId
    })
  );

  return jobRun;
}

export async function getNextJobRun(jobId: string) {
  const jobRun = await client.jobs.getJobNextRuns(
    new GetJobNextRunsRequest({
      jobId
    })
  );

  return jobRun.nextRuns;
}

export async function pauseJobRun(jobRunId: string, isPause: boolean) {
  const jobRun = await client.jobs.pauseJob(
    new PauseJobRequest({
      id: jobRunId,
      pause: isPause
    })
  );

  return jobRun;
}

export async function getJobRecentRun(jobId: string) {
  const jobRun = await client.jobs.getJobRecentRuns(
    new GetJobRecentRunsRequest({
      jobId
    })
  );

  return jobRun.recentRuns;
}

export async function getJobStatus(jobId: string) {
  const jobRun = await client.jobs.getJobStatus(
    new GetJobStatusRequest({
      jobId
    })
  );

  return jobRun.status;
}

export default {
  getJobs,
  createJob,
  getJobStatuses,
  isJobNameAvailable,
  getJob,
  deleteJob,
  createJobRun,
  getNextJobRun,
  pauseJobRun,
  getJobRecentRun,
  getJobStatus
};

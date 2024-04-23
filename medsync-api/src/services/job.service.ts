import {
  ActivityOptions,
  CreateJobRequest,
  GetJobsRequest,
  JobDestination,
  JobMapping,
  JobSource,
  RetryPolicy,
  WorkflowOptions
} from '@neosync/sdk';
import { getNeosyncContext } from '../config/neosync';
import connectionService from './connection.service';
import { convertMinutesToNanoseconds } from '../utils/utils';

const client = getNeosyncContext();

export async function getJobs(
  accountId: string,
  filter: object,
  options: { limit?: number; page?: number; sortBy?: string; sortType?: 'asc' | 'desc' }
) {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const sortBy = options.sortBy || 'createdAt';
  const sortType = options.sortType || 'desc';

  const result = await client.jobs.getJobs(
    new GetJobsRequest({
      accountId
    })
  );

  return result;
}

export async function createJob(
  accountId: string,
  job_name: string,
  mappings: any,
  source: {
    connectionId: string;
    connectionConfig: any;
  },
  destionations: any,
  cron_schedule?: string,
  initiate_job_run?: boolean,
  workflow_options?: any,
  sync_options?: any
) {
  const sourceConnection = await connectionService.getConnection(accountId, source.connectionId);

  let workflowOptions: WorkflowOptions | undefined = undefined;
  if (workflow_options.runTimeout) {
    workflowOptions = new WorkflowOptions({
      runTimeout: convertMinutesToNanoseconds(workflow_options.runTimeout)
    });
  }
  let syncOptions: ActivityOptions | undefined = undefined;
  if (sync_options) {
    const formSyncOpts = sync_options;
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
    jobName: job_name,
    cronSchedule: cron_schedule,
    initiateJobRun: initiate_job_run,
    mappings: mappings.map((mapping: any) => {
      return new JobMapping({
        schema: mapping.schema,
        table: mapping.table,
        column: mapping.columns,
        transformer: mapping.transformer
      });
    }),
    source: new JobSource({
      options: source.connectionConfig
    }),
    destinations: destionations.map((destination: any) => {
      return new JobDestination({
        connectionId: destination.connectionId,
        options: destination.connectionConfig
      });
    }),
    workflowOptions,
    syncOptions
  });
}

import { User } from '@prisma/client';
import { jobService } from '../services';
import catchAsync from '../utils/catchAsync';

const getJobs = catchAsync(async (req, res) => {
  const user = req.user as User;
  const jobs = await jobService.getJobs(user.neosync_account_id);
  res.send(jobs);
});

const createJob = catchAsync(async (req, res) => {
  const user = req.user as User;

  const job = await jobService.createJob(user.neosync_account_id, req.body);

  res.status(201).send(job);
});

const getJobStatuses = catchAsync(async (req, res) => {
  const user = req.user as User;

  const statuses = await jobService.getJobStatuses(user.neosync_account_id);

  res.send(statuses);
});

const isJobNameAvailable = catchAsync(async (req, res) => {
  const user = req.user as User;
  const name = req.query.name as string;

  const isAvailable = await jobService.isJobNameAvailable(user.neosync_account_id, name);

  res.send({ isAvailable });
});

const getJob = catchAsync(async (req, res) => {
  const user = req.user as User;
  const jobId = req.params.jobId;

  const job = await jobService.getJob(user.neosync_account_id, jobId);

  res.send(job);
});

const deleteJob = catchAsync(async (req, res) => {
  const user = req.user as User;
  const jobId = req.params.jobId;

  await jobService.deleteJob(user.neosync_account_id, jobId);

  res.send({
    message: 'Job deleted'
  });
});

const createJobRun = catchAsync(async (req, res) => {
  const jobId = req.params.jobId;

  await jobService.createJobRun(jobId);

  res.send({
    message: 'Job run created'
  });
});

const getNextJobRun = catchAsync(async (req, res) => {
  const jobId = req.params.jobId;

  const jobRun = await jobService.getNextJobRun(jobId);

  res.send(jobRun);
});

const pauseJob = catchAsync(async (req, res) => {
  const is_pause = req.query.is_pause;
  const jobId = req.params.jobId;

  await jobService.pauseJobRun(jobId, Boolean(is_pause));

  res.send({
    message: 'Job paused'
  });
});

const getJobRecentRun = catchAsync(async (req, res) => {
  const jobId = req.params.jobId;

  const jobRuns = await jobService.getJobRecentRun(jobId);

  res.send(jobRuns);
});

const getJobStatus = catchAsync(async (req, res) => {
  const jobId = req.params.jobId;

  const jobStatus = await jobService.getJobStatus(jobId);

  res.send(jobStatus);
});

export default {
  getJobs,
  createJob,
  getJobStatuses,
  isJobNameAvailable,
  getJob,
  deleteJob,
  createJobRun,
  getNextJobRun,
  pauseJob,
  getJobRecentRun,
  getJobStatus
};

import { jobService } from '../services';
import catchAsync from '../utils/catchAsync';

const getJobs = catchAsync(async (req, res) => {
  const accountId = req.user?.neosync_account_id;
  const jobs = await jobService.getJobs(accountId);
  res.send(jobs);
});

const createJob = catchAsync(async (req, res) => {
  const accountId = req.user?.neosync_account_id;

  const job = await jobService.createJob(accountId, req.body);

  res.status(201).send(job);
});

const getJobStatuses = catchAsync(async (req, res) => {
  const accountId = req.user?.neosync_account_id;

  const statuses = await jobService.getJobStatuses(accountId);

  res.send(statuses);
});

const isJobNameAvailable = catchAsync(async (req, res) => {
  const accountId = req.user?.neosync_account_id;
  const name = req.query.name as string;

  const isAvailable = await jobService.isJobNameAvailable(accountId, name);

  res.send({ isAvailable });
});

const getJob = catchAsync(async (req, res) => {
  const accountId = req.user?.neosync_account_id;
  const jobId = req.params.jobId;

  const job = await jobService.getJob(accountId, jobId);

  res.send(job);
});

const deleteJob = catchAsync(async (req, res) => {
  const accountId = req.user?.neosync_account_id;
  const jobId = req.params.jobId;

  await jobService.deleteJob(accountId, jobId);

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

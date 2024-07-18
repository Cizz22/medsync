import { User } from '@prisma/client';
import { jobService } from '../services';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';

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

  res.status(httpStatus.OK).send();
});

const createJobRun = catchAsync(async (req, res) => {
  const jobId = req.body.jobId

  const jobRun = await jobService.createJobRun(jobId);

  res.send(jobRun);
});

const getNextJobRun = catchAsync(async (req, res) => {
  const jobId = req.params.jobId;

  const jobRun = await jobService.getNextJobRun(jobId);

  res.send(jobRun);
});

const pauseJob = catchAsync(async (req, res) => {
  const is_pause = req.query.is_pause as String;
  const jobId = req.params.jobId;
  
  const pause = is_pause === 'true'  

<<<<<<< HEAD
<<<<<<< HEAD
=======
  const pause = is_pause === 'true' 

>>>>>>> fe278b6bfb40f7e747e088a9e06da53ed0eea886
=======
>>>>>>> 926743aa4078e8bcd0bc52abcf60d8a9b50570e8
  await jobService.pauseJobRun(jobId, pause);

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

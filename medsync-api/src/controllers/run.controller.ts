import { User } from '@prisma/client';
import { RunService } from '../services';
import catchAsync from '../utils/catchAsync';

const getRuns = catchAsync(async (req, res) => {
  const user = req.user as User;
  const jobId = req.query.jobId?.toString() ?? '';
  const runs = await RunService.getRuns(user.neosync_account_id, jobId);

  res.send(runs);
});

const getRun = catchAsync(async (req, res) => {
  const user = req.user as User;
  const runId = req.params.runId;
  const run = await RunService.getRun(user.neosync_account_id, runId);

  res.send(run);
});

const deleteRun = catchAsync(async (req, res) => {
  const user = req.user as User;
  const runId = req.params.runId;
  await RunService.deleteRun(user.neosync_account_id, runId);

  res.status(204).send();
});

const cancelRun = catchAsync(async (req, res) => {
  const user = req.user as User;
  const runId = req.params.runId;
  await RunService.cancelRun(user.neosync_account_id, runId);

  res.status(204).send();
});

const getRunEvents = catchAsync(async (req, res) => {
  const user = req.user as User;
  const runId = req.params.runId;
  const events = await RunService.getJobRunEvents(user.neosync_account_id, runId);

  res.send(events);
});

const getRunLogs = catchAsync(async (req, res) => {
  const user = req.user as User;
  const runId = req.params.runId;
  const logLevel = req.query.logLevel as string;
  const logs = await RunService.getJobRunLogs(user.neosync_account_id, runId, logLevel);

  res.send(logs);
});

const terminateRun = catchAsync(async (req, res) => {
  const user = req.user as User;
  const runId = req.params.runId;
  await RunService.terminateRun(user.neosync_account_id, runId);

  res.status(204).send();
});

export default {
  getRuns,
  getRun,
  deleteRun,
  cancelRun,
  getRunEvents,
  getRunLogs,
  terminateRun
};

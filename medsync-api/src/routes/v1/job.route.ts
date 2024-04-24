import express from 'express';
// import validate from '../../middlewares/validate';
import auth from '../../middlewares/auth';
import { jobController } from '../../controllers';

const router = express.Router();

router.route('/').post(auth(), jobController.createJob).get(auth(), jobController.getJobs);
router.route('/statuses').get(auth(), jobController.getJobStatuses);
router.route('/name-available').get(auth(), jobController.isJobNameAvailable);
router.route('/:jobId').get(auth(), jobController.getJob).delete(auth(), jobController.deleteJob);
router.route('/:jobId/create-run').post(auth(), jobController.createJobRun);
router.route('/:jobId/next-run').get(auth(), jobController.getNextJobRun);
router.route('/:jobId/pause').get(auth(), jobController.pauseJob);
router.route('/:jobId/recent-run').get(auth(), jobController.getJobRecentRun);
router.route('/:jobId/status').get(auth(), jobController.getJobStatus);

export default router;

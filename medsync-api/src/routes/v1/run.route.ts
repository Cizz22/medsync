import express from 'express';
// import validate from '../../middlewares/validate';
import auth from '../../middlewares/auth';
import { runController } from '../../controllers';

const router = express.Router();

router.route('/').get(auth(), runController.getRuns);

router.route('/:runId').get(auth(), runController.getRun).delete(auth(), runController.deleteRun);

router.route('/:runId/cancel').post(auth(), runController.cancelRun);

router.route('/:runId/events').get(auth(), runController.getRunEvents);

router.route('/:runId/logs').get(auth(), runController.getRunLogs);

router.route('/:runId/terminate').post(auth(), runController.terminateRun);

export default router;

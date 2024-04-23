import express from 'express';
import validate from '../../middlewares/validate';
import authValidation from '../../validations/auth.validation';
import { authController } from '../../controllers';
import auth from '../../middlewares/auth';
import connectionController from '../../controllers/connection.controller';

const router = express.Router();

router
  .route('/')
  .post(auth(), connectionController.createConnection)
  .get(auth(), connectionController.getConnections);

router
  .route('/:connectionId')
  .get(auth(), connectionController.getConnection)
  .delete(auth(), connectionController.deleteConnection);

router.route('/check').post(auth(), connectionController.checkConnectionConfig);

export default router;

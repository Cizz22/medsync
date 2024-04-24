import express from 'express';
import validate from '../../middlewares/validate';
import auth from '../../middlewares/auth';
import connectionController from '../../controllers/connection.controller';
import { connectionValidation } from '../../validations';

const router = express.Router();

router
  .route('/')
  .post(
    auth(),
    validate(connectionValidation.createConnection),
    connectionController.createConnection
  )
  .get(auth(), validate(connectionValidation.getConnections), connectionController.getConnections);

router
  .route('/:connectionId')
  .get(auth(), validate(connectionValidation.getConnection), connectionController.getConnection)
  .delete(
    auth(),
    validate(connectionValidation.deleteConnection),
    connectionController.deleteConnection
  );

router
  .route('/check')
  .post(
    auth(),
    validate(connectionValidation.checkConnectionConfig),
    connectionController.checkConnectionConfig
  );

export default router;
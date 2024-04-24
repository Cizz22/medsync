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

/**
 * @swagger
 * tags:
 *   name: Connection
 *   description: Connection management and retrieval
 */

/**
 * @swagger
 * /connections:
 *  post:
 *   summary: Create a new connection
 *   tags: [Connection]
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *     required: true
 *     content:
 *      application/json:
 *        schema:
 *         type: object
 *         required:
 *            - connection_type
 *            - name
 *            - connection_config
 *         properties:
 *           connection_type:
 *            type: string
 *          name:
 *           type: string
 *         connection_config:
 *          type: object
 *  responses:
 *   201:
 *    description: Created
 *    content:
 *      application/json:
 *       schema:
 *        - $ref: '#/components/schemas/Connection'
 *   401:
 *    $ref: '#/components/responses/Unauthorized'
 *   403
 *    $ref: '#/components/responses/Forbidden'
 *
 */

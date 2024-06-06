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
  .route('/check')
  .post(
    auth(),
    connectionController.checkConnectionConfig
  );

router.route('/name-available').get(auth(), connectionController.isConnectionNameAvailable);

router
  .route('/:connectionId')
  .get(auth(), validate(connectionValidation.getConnection), connectionController.getConnection)
  .delete(
    auth(),
    validate(connectionValidation.deleteConnection),
    connectionController.deleteConnection
  );

router.route('/:connectionId/schema').get(auth(), connectionController.checkConnectionSchema);

router
  .route('/:connectionId/constrains/primary')
  .get(auth(), connectionController.getConnectionPrimaryConstraints);

router
  .route('/:connectionId/constrains/unique')
  .get(auth(), connectionController.getConnectionUniqueConstrains);

router
  .route('/:connectionId/constrains/foreign')
  .get(auth(), connectionController.getConnectionForeignConstraints);

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

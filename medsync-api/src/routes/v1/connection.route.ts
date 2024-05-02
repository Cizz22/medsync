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

/**
 * @swagger
 * /connections:
 *  get:
 *   summary: Get all connections
 *   tags: [Connection]
 *   security:
 *   - bearerAuth: []
 *   responses:
 *    200:
 *     description: Success. Returns an array of connections.
 *     content:
 *       application/json:
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Connection'
 */

/**
 * @swagger
 * /connections:
 *  post:
 *   summary: Create a new connection
 *   tags: [Connection]
 *   security:
 *   - bearerAuth: []
 *   requestBody:
 *     description: Data for creating a new connection
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/NewConnection'
 *   responses:
 *    200:
 *     description: Success. The connection has been created.
 *    400:
 *     description: Bad Request. Invalid input provided.
 *    401:
 *     description: Unauthorized. Authentication credentials are missing or invalid.
 */

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

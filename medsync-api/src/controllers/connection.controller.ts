import { connectionService } from '../services';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
// import pick from '../utils/pick';
import { User } from '@prisma/client';

const getConnections = catchAsync(async (req, res) => {
  const user = req.user as User;
  // const filter = pick(req.query, ['name', 'role']);
  // const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const connections = await connectionService.getConnections(user.neosync_account_id);
  res.send(connections);
});

const createConnection = catchAsync(async (req, res) => {
  const { connection_type, name, connection_config } = req.body;
  const user = req.user as User;
  const connection = await connectionService.createConnection(
    connection_type,
    user.neosync_account_id,
    name,
    connection_config
  );

  res.status(httpStatus.CREATED).send(connection);
});

const getConnection = catchAsync(async (req, res) => {
  const connectionId = req.params.connectionId;
  const user = req.user as User;
  const connection = await connectionService.getConnection(user.neosync_account_id, connectionId);
  res.send(connection);
});

const deleteConnection = catchAsync(async (req, res) => {
  const connectionId = req.params.connectionId;
  await connectionService.deleteConnection(connectionId);
  res.status(httpStatus.NO_CONTENT).send();
});

const checkConnectionConfig = catchAsync(async (req, res) => {
  const connectionId = req.params.connectionId;
  const user = req.user as User;

  const response = await connectionService.checkConnectionConfig(
    user.neosync_account_id,
    connectionId
  );

  res.send(response);
});

const checkConnectionSchema = catchAsync(async (req, res) => {
  const connectionId = req.params.connectionId;

  const response = await connectionService.checkConnectionSchema(connectionId);

  res.send(response);
});

export default {
  getConnections,
  createConnection,
  getConnection,
  deleteConnection,
  checkConnectionConfig,
  checkConnectionSchema
};

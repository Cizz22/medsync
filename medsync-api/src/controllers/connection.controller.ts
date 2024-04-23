import { connectionService } from '../services';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
import pick from '../utils/pick';

const getConnections = catchAsync(async (req, res) => {
  const accountId = req.user?.neosync_account_id;
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const connections = await connectionService.getConnections(accountId, filter,options);
  res.send(connections);
});

const createConnection = catchAsync(async (req, res) => {
  const { connection_type, name, connection_config } = req.body;
  const accountId = req.user?.neosync_account_id;
  const connection = await connectionService.createConnection(
    connection_type,
    accountId,
    name,
    connection_config
  );

  res.status(httpStatus.CREATED).send(connection);
});

const getConnection = catchAsync(async (req, res) => {
  const connectionId = req.params.connectionId;
  const accountId = req.user?.neosync_account_id;
  const connection = await connectionService.getConnection(accountId, connectionId);
  res.send(connection);
});

const deleteConnection = catchAsync(async (req, res) => {
  const connectionId = req.params.connectionId;
  await connectionService.deleteConnection(connectionId);
  res.status(httpStatus.NO_CONTENT).send();
});

const checkConnectionConfig = catchAsync(async (req, res) => {
  const { connection_type, connection_config } = req.body;

  const response = await connectionService.checkConnectionConfig(
    connection_type,
    connection_config
  );

  res.send(response);
});

export default {
  getConnections,
  createConnection,
  getConnection,
  deleteConnection,
  checkConnectionConfig
};

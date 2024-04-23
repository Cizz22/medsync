import { connectionService } from '../services';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';

const getConnections = catchAsync(async (req, res) => {
  const accountId = req.params.account_id;
  const connections = await connectionService.getConnections(accountId);
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
  const accountId = req.user.neosync_account_id;
  const connection = await connectionService.getConnection(accountId, connectionId);
  res.send(connection);
});

const deleteConnection = catchAsync(async (req, res) => {
  const connectionId = req.params.connectionId;
  await connectionService.deleteConnection(connectionId);
  res.status(httpStatus.NO_CONTENT).send();
});

const checkConnectionConfig = catchAsync(async (req, res) => {
  const {connection_type, connection_config} = req.body;

  const response = await connectionService.checkConnectionConfig(
    connection_type,
    connection_config
  );

  res.send(response);
})

export default {
  getConnections,
  createConnection,
  getConnection,
  deleteConnection,
  checkConnectionConfig
};

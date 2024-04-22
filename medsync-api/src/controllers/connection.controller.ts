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
  const accoundId = req.params.accountId;
  const connection = await connectionService.createConnection(
    connection_type,
    accoundId,
    name,
    connection_config
  );

  res.status(httpStatus.CREATED).send(connection);
});

export default {
  getConnections,
  createConnection
};

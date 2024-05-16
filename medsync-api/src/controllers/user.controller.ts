import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { userService } from '../services';
import { User } from '@prisma/client';

const createUser = catchAsync(async (req, res) => {
  const { email, password, name, role } = req.body;
  const user = await userService.createUser(email, password, name, role);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const whoAmI = catchAsync(async (req, res) => {
  const user = req.user as User;

  const userRes = await userService.getUserById(user.id);

  res.send(userRes);
});

const getUserTemporalConfig = catchAsync(async (req, res) => {
  const user = req.user as User;

  const userTemporalConfig = await userService.getUserTemporalConfig(user.neosync_account_id);

  res.send(userTemporalConfig);
});

const getUserAccountOnBoardingConfig = catchAsync(async (req, res) => {
  const user = req.user as User;

  const userAccountOnBoardingConfig = await userService.getUserAccountOnBoardingConfig(
    user.neosync_account_id
  );

  res.send(userAccountOnBoardingConfig);
});

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  whoAmI,
  getUserTemporalConfig,
  getUserAccountOnBoardingConfig
};

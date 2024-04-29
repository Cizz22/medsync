import { User } from '@prisma/client';
import { TransformerService } from '../services';
import catchAsync from '../utils/catchAsync';

const getUserDefinedTransformers = catchAsync(async (req, res) => {
  const user = req.user as User;
  const transformers = await TransformerService.getUserDefinedTransformers(user.neosync_account_id);

  res.send(transformers);
});

const getUserDefinedTransformer = catchAsync(async (req, res) => {
  const user = req.user as User;
  const transformerId = req.params.transformerId;

  const transformer = await TransformerService.getUserDefinedTransformer(
    user.neosync_account_id,
    transformerId
  );

  res.send(transformer);
});

const createUserDefinedTransformer = catchAsync(async (req, res) => {
  const user = req.user as User;
  const { name, description, source, config } = req.body;

  const transformer = await TransformerService.createuserDefinedTransformer(
    user.neosync_account_id,
    name,
    description,
    source,
    config
  );

  res.status(201).send(transformer);
});

const deleteUserDefinedTransformer = catchAsync(async (req, res) => {
  const user = req.user as User;
  const transformerId = req.params.transformerId;

  await TransformerService.deleteuserDefinedTransformer(user.neosync_account_id, transformerId);

  res.status(204).send();
});

const isNameAvailable = catchAsync(async (req, res) => {
  const user = req.user as User;
  const { name } = req.body;

  const isAvailable = await TransformerService.isTransformerNameAvailable(
    user.neosync_account_id,
    name
  );

  res.send(isAvailable);
});

const validateTransformerCode = catchAsync(async (req, res) => {
  const user = req.user as User;
  const { code } = req.body;

  const isValid = await TransformerService.validateTransformerCode(user.neosync_account_id, code);

  res.send(isValid);
});

const validateTransformerRegex = catchAsync(async (req, res) => {
  const user = req.user as User;
  const { regex } = req.body;

  const isValid = await TransformerService.validateTransformerRegex(user.neosync_account_id, regex);

  res.send(isValid);
});

const getSystemTransformers = catchAsync(async (req, res) => {
  const transformers = await TransformerService.getSystemTransformers();

  res.send(transformers);
});

const getSystemTransformer = catchAsync(async (req, res) => {
  const transformerId = req.params.transformerId;

  const transformer = await TransformerService.getSystemTransformer(transformerId);

  res.send(transformer);
});

export default {
  getUserDefinedTransformers,
  getUserDefinedTransformer,
  createUserDefinedTransformer,
  deleteUserDefinedTransformer,
  isNameAvailable,
  validateTransformerCode,
  validateTransformerRegex,
  getSystemTransformers,
  getSystemTransformer
};

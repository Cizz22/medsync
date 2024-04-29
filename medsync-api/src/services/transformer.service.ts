import {
  CreateUserDefinedTransformerRequest,
  GetSystemTransformerBySourceRequest,
  GetSystemTransformersRequest,
  GetUserDefinedTransformerByIdRequest,
  GetUserDefinedTransformersRequest,
  IsTransformerNameAvailableRequest,
  TransformerConfig,
  ValidateUserJavascriptCodeRequest,
  ValidateUserRegexCodeRequest
} from '@neosync/sdk';
import { getNeosyncContext } from '../config/neosync';

const client = getNeosyncContext();

export async function isTransformerNameAvailable(accountId: string, name: string) {
  const isNameAvailable = await client.transformers.isTransformerNameAvailable(
    new IsTransformerNameAvailableRequest({
      transformerName: name,
      accountId
    })
  );

  return isNameAvailable.isAvailable;
}

export async function getUserDefinedTransformers(accountId: string) {
  const result = await client.transformers.getUserDefinedTransformers(
    new GetUserDefinedTransformersRequest({
      accountId
    })
  );

  return result.transformers;
}

export async function createuserDefinedTransformer(
  accountId: string,
  name: string,
  description: string,
  source: number,
  config: any
) {
  const body = new CreateUserDefinedTransformerRequest({
    accountId,
    name,
    description,
    source,
    transformerConfig: new TransformerConfig({
      config: {
        case: config.case,
        value: config.value
      }
    })
  });

  const transformer = await client.transformers.createUserDefinedTransformer(body);

  return transformer.transformer;
}

export async function deleteuserDefinedTransformer(accountId: string, transformerId: string) {
  await client.transformers.deleteUserDefinedTransformer({
    transformerId
  });

  return true;
}

export async function getUserDefinedTransformer(accountId: string, transformerId: string) {
  const transformer = await client.transformers.getUserDefinedTransformerById(
    new GetUserDefinedTransformerByIdRequest({
      transformerId
    })
  );

  return transformer.transformer;
}

export async function validateTransformerCode(accountId: string, code: string) {
  const result = await client.transformers.validateUserJavascriptCode(
    new ValidateUserJavascriptCodeRequest({
      accountId,
      code
    })
  );

  return result.valid;
}

export async function validateTransformerRegex(accountId: string, regex: string) {
  const result = await client.transformers.validateUserRegexCode(
    new ValidateUserRegexCodeRequest({
      accountId,
      userProvidedRegex: regex
    })
  );

  return result.valid;
}

export async function getSystemTransformers() {
  const result = await client.transformers.getSystemTransformers(
    new GetSystemTransformersRequest({})
  );

  return result.transformers;
}

export async function getSystemTransformer(source: number) {
  const result = await client.transformers.getSystemTransformerBySource(
    new GetSystemTransformerBySourceRequest({
      source
    })
  );

  return result.transformer;
}

export default {
  isTransformerNameAvailable,
  getUserDefinedTransformers,
  createuserDefinedTransformer,
  deleteuserDefinedTransformer,
  getUserDefinedTransformer,
  validateTransformerCode,
  validateTransformerRegex,
  getSystemTransformers,
  getSystemTransformer
};

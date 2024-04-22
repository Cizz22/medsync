import {
  Code,
  ConnectError,
  GetAccessTokenFn,
  NeosyncClient,
  getNeosyncClient
} from '@neosync/sdk';
import { createConnectTransport } from '@connectrpc/connect-node';
import config from './config';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

export function getNeosyncContext(): NeosyncClient {
  try {
    const neoSyncClient: NeosyncClient = getNeosyncClient({
      getAccessToken: getAccessTokenFn(config.isAuthEnabled),
      getTransport(interceptors) {
        return createConnectTransport({
          baseUrl: config.neosync.apiUrl,
          httpVersion: '2',
          interceptors: interceptors
        });
      }
    });

    return neoSyncClient;
  } catch (err) {
    if (err instanceof ConnectError) {
      throw new ApiError(translateGrpcCodeToHttpCode(err.code), err.message, true);
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'unknown error type on neosync');
    }
  }
}

function getAccessTokenFn(isAuthEnabled: boolean): GetAccessTokenFn | undefined {
  if (!isAuthEnabled) {
    return undefined;
  }
  // return async (): Promise<string> => {
  //   const session = await auth();
  //   const accessToken = session?.accessToken;
  //   if (!accessToken) {
  //     throw new Error('no session provided');
  //   }
  //   return accessToken;
  // };
}

function translateGrpcCodeToHttpCode(code: Code): number {
  switch (code) {
    case Code.InvalidArgument:
    case Code.FailedPrecondition:
    case Code.OutOfRange: {
      return 400;
    }
    case Code.Unauthenticated: {
      return 401;
    }
    case Code.PermissionDenied: {
      return 403;
    }
    case Code.Unimplemented:
    case Code.NotFound: {
      return 404;
    }
    case Code.AlreadyExists: {
      return 409;
    }
    case Code.Unavailable: {
      return 503;
    }
    default: {
      return 500;
    }
  }
}

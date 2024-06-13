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
      getAccessToken: getAccessToken(config.isAuthEnabled),
      getTransport(interceptors) {
        return createConnectTransport({
          baseUrl: config.neosync.apiUrl,
          httpVersion: '2',
          interceptors: interceptors
        });
      }
    });

    return neoSyncClient;
  } catch (err: any) {
    if (err instanceof ConnectError) {
      throw new ApiError(translateGrpcCodeToHttpCode(err.code), err.message);
    }

    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to connect to Neosync');
  }
}

function getAccessToken(isAuthEnabled:boolean): GetAccessTokenFn | undefined {
  if(!isAuthEnabled){
    return undefined
  }
  
  const test = async () => {
    try {
      const body = new URLSearchParams({
        grant_type: 'password',
        client_id: 'neosync-app',
        client_secret: '72alWGzhHInDskRHduTQ8BjB4Lgn0n3a',
        username: 'usermain@gmail.com',
        password: '12345678'
      });
      const res = await fetch(
        'http://116.193.191.197:8083/realms/neosync/protocol/openid-connect/token',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          body: body
        }
      );

      const resData = await res.json();

      return resData.access_token;
    } catch (err: any) {
      throw new Error(err);
    }
  };
  return test;
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
function getAccessTokenFn() {
  throw new Error('Function not implemented.');
}

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
import axios from 'axios';
import { token } from 'morgan';

export function getNeosyncContext(): NeosyncClient {
  try {
    const neoSyncClient: NeosyncClient = getNeosyncClient({
      getAccessToken: getAccessToken(),
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

function getAccessToken(): GetAccessTokenFn | undefined {
  return async (): Promise<string> => {
    const postData = new URLSearchParams({
      grant_type: 'password',
      client_id: 'neosync-app',
      client_secret: '72alWGzhHInDskRHduTQ8BjB4Lgn0n3a',
      username: 'cisatraa@gmail.com',
      password: '12345678'
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: postData
    };

    const response = await fetch(
      'http://116.193.191.197:8083/realms/neosync/protocol/openid-connect/token',
      requestOptions
    );

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const token = await response.json();
    return token.access_token;
  };
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

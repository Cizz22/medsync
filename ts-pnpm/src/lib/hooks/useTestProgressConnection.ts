
import { CheckConnectionConfigResponse, ConnectionConfig, ConnectionResponse, ConnectionRolePrivilege } from './useGetConnection';
import {HookReply} from './types'
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";

export function TestProgressConnection(
    accountId:string,
    token:string,
    data: any
):HookReply<CheckConnectionConfigResponse>{
    let requestBody= {}
    let canProcced: boolean = false;

    const db = data.connection
    const tunnel = data.tunnel
    
    requestBody = { db, tunnel, connection_type: 'postgresql' };
    canProcced = true

    const fetcher = async ([url, token]: [string, string]):Promise<CheckConnectionConfigResponse> => 
        {
            const res = await fetch(
                url,
                {
                    method:'post',
                    headers:{
                        'Content-Type': 'application/json',
                        'token':token
                    },
                    body:JSON.stringify(requestBody)
                }
            )

            const body = await res.json();

            if (res.ok) {
                return body;
              }
              if (body.error) {
                throw new Error(body.error);
              }
              if (res.status > 399 && body.message) {
                throw new Error(body.message);
              }
              throw new Error('Unknown error when fetching');
        }
        
    return useAuthenticatedFetch<CheckConnectionConfigResponse>(
        `/api/accounts/${accountId}/connections/check`, 
        !!accountId && canProcced,
        token,
        undefined,
        fetcher
    )

}
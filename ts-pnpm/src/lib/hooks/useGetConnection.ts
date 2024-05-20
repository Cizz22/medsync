import { HookReply } from "@/lib/hooks/types"
import { useAuthenticatedFetch } from "@/lib/hooks/useAuthenticatedFetch"


export interface ConnectionConfig {
  config: {
    case: string,
    value: any
  }
}

export interface ConnectionResponse {
  id: string,
  name: string,
  connectionConfig: ConnectionConfig,
  created_by_user_id: string,
  createdAt: string,
  updated_by_user_id: string,
  updatedAt: string,
  account_id: string
}

export interface CheckConnectionConfigResponse {
  isConnected: boolean,
  connectionError?: string
  privilage: ConnectionRolePrivilege[]
}

export interface ConnectionRolePrivilege {
  grantees: string,
  schema: string,
  table: string,
  privilage_type: string[]
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function useGetConnection(
  accountId: string,
  token: string,
  id: string
): HookReply<ConnectionResponse> {
  return useAuthenticatedFetch(
    `/api/accounts/${accountId}/connections/${id}`,
    !!accountId && !!token,
    token
  )
}
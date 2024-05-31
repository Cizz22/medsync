import { HookReply } from "@/lib/hooks/types";
import { useAuthenticatedFetch } from "@/lib/hooks/useAuthenticatedFetch";
import { ConnectionResponse } from "@/lib/hooks/useGetConnection";

export function useGetConnections(
  accountId: string | undefined,
  token: string | undefined
): HookReply<Array<ConnectionResponse>> {
  return useAuthenticatedFetch(
    `/api/accounts/${accountId}/connections`,
    !!accountId && !!token,
    token
  )
}
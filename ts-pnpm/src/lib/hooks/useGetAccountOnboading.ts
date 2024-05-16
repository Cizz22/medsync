
import { HookReply } from './types';
import { useAuthenticatedFetch } from './useAuthenticatedFetch';


interface OnboardingConfigResponse {
    hasCreatedSourceConnection: boolean;
    hasCreatedDestinationConnection: boolean;
    hasCreatedJob: boolean;
    hasInvitedMembers?: boolean;
}

export function useGetAccountOnboardingConfig(
    accountId: string,
    token: string
): HookReply<OnboardingConfigResponse> {
    return useAuthenticatedFetch(
        `/api/users/${accountId}/onboarding-config`,
        !!accountId && !!token,
        token,
        undefined
    );
}

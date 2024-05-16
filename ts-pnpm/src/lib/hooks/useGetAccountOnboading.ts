
import { useAuthenticatedFetch } from './useAuthenticatedFetch';

export function useGetAccountOnboardingConfig(
    accountId: string,
    token: string
) {
    return useAuthenticatedFetch(
        `/api/users/${accountId}/onboarding-config`,
        !!accountId && !!token,
        token,
        undefined
    );
}

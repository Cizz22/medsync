import SiteFooter from './SiteFooter';
import OnboardingChecklist from './onboarding-checklist/OnboardingChecklist';
import AccountProvider from './providers/account-provider';
import { PostHogIdentifier } from './providers/posthog-provider';
import { SessionProvider } from './providers/session-provider';
import SiteHeader from './site-header/SiteHeader';
import { Toaster } from './ui/toaster';
import { ReactElement, ReactNode, Suspense } from 'react';
// import { auth } from './api/auth/[...nextauth]/auth';

interface Props {
  children: ReactNode;
}

export default async function BaseLayout(props: Props): Promise<ReactElement> {
  const { children } = props;
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <AccountProvider>
        <Suspense>
          <PostHogIdentifier />
        </Suspense>
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1 container" id="top-level-layout">
            {children}
          </div>
          <SiteFooter />
          <Toaster />
          <OnboardingChecklist />
        </div>
      </AccountProvider>
    </SessionProvider>
  );
}

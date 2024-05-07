import { ReactElement, ReactNode } from 'react';

import OnboardingChecklist from '@/components/onboarding-checklist/OnboardingChecklist';
// import AccountProvider from '@/components/providers/account-provider';
import { SessionProvider } from '@/components/providers/session-provider';
import SiteHeader from '@/components/site-header/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { Toaster } from '@/components/ui/toaster';

import { auth } from '../api/auth/[...nextauth]/auth';

interface Props {
  children: ReactNode;
}

export default async function BaseLayout(props: Props): Promise<ReactElement> {
  const { children } = props;
  const session = await auth();

  return (
    <SessionProvider session={session}>
      {/* <AccountProvider> */}
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1 container" id="top-level-layout">
            {children}
          </div>
          <SiteFooter />
          <Toaster />
          {/* <OnboardingChecklist /> */}
        </div>
      {/* </AccountProvider> */}
    </SessionProvider>
  );
}

import { Metadata } from 'next';
import { ReactElement } from 'react';

import '@/app/globals.css';

import AccountProvider from '@/components/providers/account-provider';
import { SessionProvider } from '@/components/providers/session-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import SiteHeader from '@/components/site-header/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { Toaster } from '@/components/ui/toaster';

import { auth } from '../api/auth/[...nextauth]/auth';
import { useGetUserAccounts } from '@/lib/hooks/useUserAccounts';

export const metadata: Metadata = {
  title: 'Medsync',
  description: 'Open Source Test Data Management',
  icons: [{ rel: 'icon', url: '#' }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<ReactElement> {
  const session = await auth();
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-background font-sans antialiased overflow-scroll">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <>
            <SessionProvider session={session}>
              <AccountProvider session={session}>
                <div className="relative flex min-h-screen flex-col">
                  <SiteHeader />
                  <div className="flex-1 container" id="top-level-layout">
                    {children}
                  </div>
                  <SiteFooter />
                  <Toaster />
                  {/* <OnboardingChecklist /> */}
                </div>
              </AccountProvider>
            </SessionProvider>

          </>
        </ThemeProvider>
      </body>
    </html>
  );
}

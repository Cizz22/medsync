import { Metadata } from 'next';
import { ReactElement } from 'react';

import '@/app/globals.css';

import { ThemeProvider } from '@/components/providers/theme-provider';


export const metadata: Metadata = {
  title: 'Neosync',
  description: 'Open Source Test Data Management',
  icons: [{ rel: 'icon', url: '#' }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<ReactElement> {
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
              {children}
          </>
        </ThemeProvider>
      </body>
    </html>
  );
}

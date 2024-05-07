'use client';

import { isPast, parseISO } from 'date-fns';
import { Session } from 'next-auth';
import {
  SessionProvider as NextAuthSessionProvider,
  signIn,
} from 'next-auth/react';
import { ReactNode } from 'react';

// import { useGetSystemAppConfig } from '@/libs/hooks/useGetSystemAppConfig';
import { Skeleton } from '../ui/skeleton';

interface Props {
  children: ReactNode;
  session: Session | null;
}

export function SessionProvider({ children, session }: Props) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}

// function isSessionValid(session: Session | null): boolean {
//   if (!session) {
//     return false;
//   }
//   const expiryDate = parseISO(session.expires);
//   return !isPast(expiryDate);
// }

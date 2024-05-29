'use client';

import { isPast, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import {
  SessionProvider as NextAuthSessionProvider,
  signIn,
  signOut,
} from 'next-auth/react';
import { ReactNode } from 'react';

// import { useGetSystemAppConfig } from '@/libs/hooks/useGetSystemAppConfig';
import { Skeleton } from '../ui/skeleton';

interface Props {
  children: ReactNode;
  session: Session | null;
}

export function SessionProvider({ children, session }: Props) {
  const router = useRouter();

  if (!session) {
    router.push('/login');
  }

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

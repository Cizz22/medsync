'use client';
import { useEffect } from 'react';

import { getErrorMessage } from '@/lib/utils';

import { useToast } from '@/components/ui/use-toast';

export function useGenericErrorToast(error?: Error): void {
  const { toast } = useToast();
  useEffect(() => {
    if (error?.message || error?.name) {
      toast({
        title:
          'There was a problem making your request. Please try again later',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [error, error?.message, error?.name, toast]);
}

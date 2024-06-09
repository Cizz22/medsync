import { TransformerHandler } from '@/components/jobs/SchemaTable/transformer-handler';
import { useMemo } from 'react';
import { useGetSystemTransformers } from './useGetSystemTransformers';
import { useGetUserDefinedTransformers } from './useGetUserDefinedTransformers';

export function useGetTransformersHandler(accountId: string, token:string): {
  handler: TransformerHandler;
  isLoading: boolean;
  isValidating: boolean;
} {
  const {
    data: systemTransformersData,
    isLoading: isLoadingSystemTransformers,
    isValidating: isSystemValidating,
  } = useGetSystemTransformers(token);
  const {
    data: customTransformersData,
    isLoading: isLoadingCustomTransformers,
    isValidating: isCustomValidating,
  } = useGetUserDefinedTransformers(accountId,token);

  const systemTransformers = systemTransformersData ?? [];
  const userDefinedTransformers = customTransformersData ?? [];

  const isLoading = isLoadingSystemTransformers || isLoadingCustomTransformers;
  const isValidating = isSystemValidating || isCustomValidating;

  const handler = useMemo(
    (): TransformerHandler =>
      new TransformerHandler(systemTransformers, userDefinedTransformers),
    [isValidating]
  );

  return {
    handler,
    isLoading,
    isValidating,
  };
}

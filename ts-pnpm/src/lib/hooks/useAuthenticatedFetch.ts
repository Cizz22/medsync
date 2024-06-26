'use client';
import useSWR, { KeyedMutator, SWRConfiguration } from 'swr';

import { HookReply } from './types';
import { useGenericErrorToast } from './useGenericErrorToast';
import { fetcher } from '../fetcher';

export function useAuthenticatedFetch<T, RawT = T>(
  fetchUrl: string,
  isReadyCondition = true,
  token?: string,
  swrConfig?: SWRConfiguration<RawT | T, Error>,
  customFetcher?: ([url, token]: [string, string]) => Promise<RawT | T>
): HookReply<RawT | T> {

  const isReady = isReadyCondition

  const fetcherToUse = customFetcher ? customFetcher : fetcher;

  const {
    data,
    error,
    mutate,
    isLoading: isDataLoading,
    isValidating,
  } = useSWR<RawT | T, Error>(
    isReady ? (token ? [fetchUrl, token] : fetchUrl) : null,
    fetcherToUse,
    swrConfig
  );

  useGenericErrorToast(error);

  // Must include the isReady check, otherwise isLoading is false, but there is no data or error
  const isLoading = !isReady || isDataLoading;

  if (isLoading) {
    return {
      isLoading: true,
      isValidating,
      data: undefined,
      error: undefined,
      mutate: mutate as KeyedMutator<unknown>,
    };
  }

  return {
    data,
    error,
    isLoading: false,
    isValidating,
    mutate,
  };
}

import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchTickets } from '../api/mockApi';
import type { Ticket, TicketFilters, TicketApiResponse } from '../types/ticket';

export interface UseTicketsResult {
  data: Ticket[];
  meta: TicketApiResponse['meta'] | null;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  retry: () => void;
  lastFetchedAt: Date | null;
}

export function useTickets(filters: TicketFilters): UseTicketsResult {
  const [data, setData] = useState<Ticket[]>([]);
  const [meta, setMeta] = useState<TicketApiResponse['meta'] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);

  // Manual trigger counter for retry
  const [retryTrigger, setRetryTrigger] = useState(0);

  // AbortController to cancel superseded requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Monotonically increasing request ID to ignore superseded responses
  const latestRequestIdRef = useRef<number>(0);

  const retry = useCallback(() => {
    setRetryTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    // 1. Cancel previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // 2. Increment request ID
    const currentRequestId = ++latestRequestIdRef.current;

    // 3. Update loading states honestly
    // If we have no data or had an error, show full loading. Otherwise show fetching indicator.
    setIsLoading(data.length === 0 && !error);
    setIsFetching(true);
    setError(null);

    // 4. Fire API request
    fetchTickets(filters, controller.signal)
      .then((response) => {
        // Race condition guard: ignore if a newer request has started
        if (currentRequestId !== latestRequestIdRef.current) {
          return;
        }

        setData(response.data);
        setMeta(response.meta);
        setError(null);
        setIsLoading(false);
        setIsFetching(false);
        setLastFetchedAt(new Date());
      })
      .catch((err: unknown) => {
        // Race condition guard: ignore if a newer request has started
        if (currentRequestId !== latestRequestIdRef.current) {
          return;
        }

        // If explicitly aborted, do nothing as a newer request is already taking over
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        // Honest Error State: A failed request shows a clear message & retry,
        // and NEVER leaves old data looking current!
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'An unexpected network error occurred while fetching tickets.';

        setError(errorMessage);
        setData([]); // Clear data so old data doesn't pretend to be current
        setMeta(null);
        setIsLoading(false);
        setIsFetching(false);
      });

    return () => {
      controller.abort();
    };
    // Include all filter fields and retryTrigger
  }, [
    filters.q,
    filters.status,
    filters.priority,
    filters.category,
    filters.sortBy,
    filters.sortOrder,
    filters.page,
    filters.pageSize,
    retryTrigger,
  ]);

  return {
    data,
    meta,
    isLoading,
    isFetching,
    error,
    retry,
    lastFetchedAt,
  };
}

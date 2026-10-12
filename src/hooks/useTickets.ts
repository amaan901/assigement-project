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

  const [retryTrigger, setRetryTrigger] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);
  const latestRequestIdRef = useRef<number>(0);

  const retry = useCallback(() => {
    setRetryTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const currentRequestId = ++latestRequestIdRef.current;

    setIsLoading(data.length === 0 && !error);
    setIsFetching(true);
    setError(null);

    fetchTickets(filters, controller.signal)
      .then((response) => {
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
        if (currentRequestId !== latestRequestIdRef.current) {
          return;
        }

        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        const errorMessage =
          err instanceof Error
            ? err.message
            : 'An unexpected network error occurred while fetching tickets.';

        setError(errorMessage);
        setData([]);
        setMeta(null);
        setIsLoading(false);
        setIsFetching(false);
      });

    return () => {
      controller.abort();
    };
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

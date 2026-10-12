import { useState, useEffect, useCallback, useRef } from 'react';
import type { TicketFilters, SortField, SortOrder } from '../types/ticket';

export const DEFAULT_FILTERS: TicketFilters = {
  q: '',
  status: 'all',
  priority: 'all',
  category: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  pageSize: 25,
};

function parseUrlParams(search: string): { filters: TicketFilters; selectedId: string | null } {
  const params = new URLSearchParams(search);

  const q = params.get('q') || DEFAULT_FILTERS.q;
  const status = params.get('status') || DEFAULT_FILTERS.status;
  const priority = params.get('priority') || DEFAULT_FILTERS.priority;
  const category = params.get('category') || DEFAULT_FILTERS.category;
  const sortBy = (params.get('sortBy') as SortField) || DEFAULT_FILTERS.sortBy;
  const sortOrder = (params.get('sortOrder') as SortOrder) || DEFAULT_FILTERS.sortOrder;

  const rawPage = parseInt(params.get('page') || '1', 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const rawPageSize = parseInt(params.get('pageSize') || '25', 10);
  const pageSize = [10, 25, 50, 100].includes(rawPageSize) ? rawPageSize : 25;

  const selectedId = params.get('selected');

  return {
    filters: {
      q,
      status,
      priority,
      category,
      sortBy,
      sortOrder,
      page,
      pageSize,
    },
    selectedId: selectedId && selectedId.trim() ? selectedId.trim() : null,
  };
}

function serializeToParams(filters: TicketFilters, selectedId: string | null): string {
  const params = new URLSearchParams();

  if (filters.q.trim()) params.set('q', filters.q.trim());
  if (filters.status !== 'all') params.set('status', filters.status);
  if (filters.priority !== 'all') params.set('priority', filters.priority);
  if (filters.category !== 'all') params.set('category', filters.category);
  if (filters.sortBy !== DEFAULT_FILTERS.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.sortOrder !== DEFAULT_FILTERS.sortOrder) params.set('sortOrder', filters.sortOrder);
  if (filters.page > 1) params.set('page', filters.page.toString());
  if (filters.pageSize !== 25) params.set('pageSize', filters.pageSize.toString());
  if (selectedId) params.set('selected', selectedId);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : window.location.pathname;
}

export function useUrlState() {
  const initial = useRef(parseUrlParams(typeof window !== 'undefined' ? window.location.search : ''));

  const [filters, setFiltersState] = useState<TicketFilters>(initial.current.filters);
  const [selectedId, setSelectedIdState] = useState<string | null>(initial.current.selectedId);

  useEffect(() => {
    const onPopState = () => {
      const parsed = parseUrlParams(window.location.search);
      setFiltersState(parsed.filters);
      setSelectedIdState(parsed.selectedId);
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  const updateUrl = useCallback(
    (newFilters: TicketFilters, newSelectedId: string | null, replace = false) => {
      const newUrl = serializeToParams(newFilters, newSelectedId);
      const currentUrl = `${window.location.pathname}${window.location.search}`;

      if (newUrl !== currentUrl) {
        if (replace) {
          window.history.replaceState(null, '', newUrl);
        } else {
          window.history.pushState(null, '', newUrl);
        }
      }
    },
    []
  );

  const setFilters = useCallback(
    (
      updater: TicketFilters | ((prev: TicketFilters) => TicketFilters),
      options?: { replace?: boolean }
    ) => {
      setFiltersState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        updateUrl(next, selectedId, options?.replace ?? false);
        return next;
      });
    },
    [selectedId, updateUrl]
  );

  const setSelectedId = useCallback(
    (id: string | null) => {
      setSelectedIdState(id);
      updateUrl(filters, id, false);
    },
    [filters, updateUrl]
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, [setFilters]);

  return {
    filters,
    setFilters,
    selectedId,
    setSelectedId,
    resetFilters,
  };
}

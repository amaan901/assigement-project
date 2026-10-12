import React, { useState, useEffect, useCallback } from 'react';
import { useUrlState } from './hooks/useUrlState';
import { useTickets } from './hooks/useTickets';
import { fetchTicketById } from './api/mockApi';
import type { Ticket, SortField } from './types/ticket';
import { Header } from './components/Header';
import { SimulationToolbar } from './components/SimulationToolbar';
import { FilterBar } from './components/FilterBar';
import { TicketTable } from './components/TicketTable';
import { TicketDrawer } from './components/TicketDrawer';
import { Pagination } from './components/Pagination';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { LiveRegion } from './components/LiveRegion';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';

export const App: React.FC = () => {
  const { filters, setFilters, selectedId, setSelectedId, resetFilters } = useUrlState();
  const { data, meta, isLoading, isFetching, error, retry } = useTickets(filters);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  useEffect(() => {
    if (!selectedId) {
      setSelectedTicket(null);
      return;
    }

    const existing = data.find((t) => t.id === selectedId);
    if (existing) {
      setSelectedTicket(existing);
      return;
    }

    let isCancelled = false;
    fetchTicketById(selectedId).then((ticket) => {
      if (!isCancelled && ticket) {
        setSelectedTicket(ticket);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [selectedId, data]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '?' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSortChange = useCallback(
    (field: SortField) => {
      setFilters((prev) => {
        if (prev.sortBy === field) {
          return {
            ...prev,
            sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
            page: 1,
          };
        }
        return {
          ...prev,
          sortBy: field,
          sortOrder: 'desc',
          page: 1,
        };
      });
    },
    [setFilters]
  );

  const handleFilterUpdate = useCallback(
    (updates: Partial<typeof filters>) => {
      setFilters((prev) => ({
        ...prev,
        ...updates,
      }));
    },
    [setFilters]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setFilters((prev) => ({
        ...prev,
        page: newPage,
      }));
    },
    [setFilters]
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setFilters((prev) => ({
        ...prev,
        pageSize: newPageSize,
        page: 1,
      }));
    },
    [setFilters]
  );

  const handleSelectTicket = useCallback(
    (ticket: Ticket) => {
      setSelectedTicket(ticket);
      setSelectedId(ticket.id);
    },
    [setSelectedId]
  );

  const handleCloseDrawer = useCallback(() => {
    setSelectedId(null);
    setSelectedTicket(null);
  }, [setSelectedId]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LiveRegion
        isLoading={isLoading}
        isFetching={isFetching}
        totalRecords={meta?.total}
        currentPage={meta?.page}
        totalPages={meta?.totalPages}
        error={error}
        searchQuery={filters.q}
      />

      <Header
        totalCount={meta?.total ?? 12500}
        isFetching={isFetching}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />



      <FilterBar
        filters={filters}
        onFilterChange={handleFilterUpdate}
        onResetFilters={resetFilters}
        statusCounts={meta?.statusCounts}
      />

      <main id="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {error ? (
          <ErrorState
            errorMessage={error}
            onRetry={retry}
            onReset={resetFilters}
            isRetrying={isFetching}
          />
        ) : isLoading ? (
          <LoadingSkeleton rows={filters.pageSize > 25 ? 15 : 10} />
        ) : data.length === 0 ? (
          <EmptyState searchQuery={filters.q} onReset={resetFilters} />
        ) : (
          <>
            <TicketTable
              tickets={data}
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
              selectedId={selectedId}
              onSortChange={handleSortChange}
              onSelectTicket={handleSelectTicket}
              isFetching={isFetching}
            />

            {meta && (
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                pageSize={meta.pageSize}
                totalRecords={meta.total}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                isFetching={isFetching}
              />
            )}
          </>
        )}
      </main>

      <TicketDrawer
        ticket={selectedTicket}
        onClose={handleCloseDrawer}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};

export default App;

import React, { useState, useEffect, useRef } from 'react';
import type { TicketFilters, TicketStatus, TicketPriority, TicketCategory } from '../types/ticket';
import { Search, X, RotateCcw, Loader2 } from 'lucide-react';

interface FilterBarProps {
  filters: TicketFilters;
  onFilterChange: (updates: Partial<TicketFilters>) => void;
  onResetFilters: () => void;
  statusCounts?: Record<TicketStatus, number>;
}

const CATEGORIES: TicketCategory[] = [
  'Billing & Payments',
  'Authentication & SSO',
  'Infrastructure & DevOps',
  'API & Webhooks',
  'Feature Request',
  'Security & Compliance',
];

const PRIORITIES: TicketPriority[] = ['Urgent', 'High', 'Medium', 'Low'];

const STATUSES: TicketStatus[] = [
  'Open',
  'In Progress',
  'Under Review',
  'Resolved',
  'Closed',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  statusCounts,
}) => {
  const [localSearch, setLocalSearch] = useState(filters.q);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalSearch(filters.q);
  }, [filters.q]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement !== searchInputRef.current &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (localSearch === filters.q) return;

    const timer = setTimeout(() => {
      onFilterChange({ q: localSearch, page: 1 });
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, filters.q, onFilterChange]);

  const handleClearSearch = () => {
    setLocalSearch('');
    searchInputRef.current?.focus();
    onFilterChange({ q: '', page: 1 });
  };

  const isDebouncing = localSearch !== filters.q;

  const isFiltered =
    filters.q !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.category !== 'all';

  return (
    <section
      aria-label="Filter tickets"
      style={{
        padding: '1rem 2rem',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-default)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
        <div
          style={{
            position: 'relative',
            minWidth: '280px',
            maxWidth: '420px',
            flex: 1,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            {isDebouncing ? (
              <Loader2 size={16} className="animate-spin" color="#4f46e5" />
            ) : (
              <Search size={16} />
            )}
          </div>
          <input
            ref={searchInputRef}
            type="search"
            role="searchbox"
            id="ticket-search"
            aria-label="Search tickets by ID, title, customer, or tags"
            placeholder="Search tickets, customers, tags... (Press '/' to focus)"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 36px 8px 36px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem',
              color: 'var(--text-primary)',
              transition: 'border-color 0.15s ease',
            }}
          />
          {localSearch && (
            <button
              onClick={handleClearSearch}
              aria-label="Clear search query"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                padding: '3px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <label htmlFor="filter-status" className="sr-only">
            Filter by status
          </label>
          <select
            id="filter-status"
            aria-label="Filter tickets by status"
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
            style={{
              padding: '8px 12px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
            }}
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st} {statusCounts ? `(${statusCounts[st] || 0})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <label htmlFor="filter-priority" className="sr-only">
            Filter by priority
          </label>
          <select
            id="filter-priority"
            aria-label="Filter tickets by priority"
            value={filters.priority}
            onChange={(e) => onFilterChange({ priority: e.target.value, page: 1 })}
            style={{
              padding: '8px 12px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
            }}
          >
            <option value="all">All Priorities</option>
            {PRIORITIES.map((pr) => (
              <option key={pr} value={pr}>
                {pr} Priority
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <label htmlFor="filter-category" className="sr-only">
            Filter by category
          </label>
          <select
            id="filter-category"
            aria-label="Filter tickets by category"
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value, page: 1 })}
            style={{
              padding: '8px 12px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
            }}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isFiltered && (
        <button
          onClick={onResetFilters}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '7px 14px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            fontSize: '0.82rem',
            fontWeight: 500,
          }}
        >
          <RotateCcw size={14} />
          <span>Reset filters</span>
        </button>
      )}
    </section>
  );
};

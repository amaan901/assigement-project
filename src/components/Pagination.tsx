import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRecords: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  isFetching?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalRecords,
  onPageChange,
  onPageSizeChange,
  isFetching,
}) => {
  const startItem = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalRecords);

  // Generate visible page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <nav
      aria-label="Table Pagination Navigation"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        gap: '1rem',
        fontSize: '0.85rem',
      }}
    >
      {/* Left: Summary text */}
      <div style={{ color: 'var(--text-secondary)' }}>
        Showing <strong>{startItem.toLocaleString()}</strong> to{' '}
        <strong>{endItem.toLocaleString()}</strong> of{' '}
        <strong>{totalRecords.toLocaleString()}</strong> tickets
      </div>

      {/* Center: Page numbers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || isFetching}
          aria-label="Go to first page"
          title="First page"
          style={{
            padding: '6px 8px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronsLeft size={15} />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isFetching}
          aria-label="Go to previous page"
          title="Previous page"
          style={{
            padding: '6px 8px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronLeft size={15} />
        </button>

        {/* Page Buttons */}
        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                style={{
                  padding: '6px 8px',
                  color: 'var(--text-muted)',
                }}
              >
                ...
              </span>
            );
          }

          const pageNum = p as number;
          const isCurrent = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              disabled={isFetching}
              aria-label={`Go to page ${pageNum}`}
              aria-current={isCurrent ? 'page' : undefined}
              style={{
                minWidth: '32px',
                height: '32px',
                padding: '0 6px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: isCurrent ? 700 : 500,
                background: isCurrent ? 'var(--brand-primary)' : 'var(--bg-surface-elevated)',
                color: isCurrent ? '#ffffff' : 'var(--text-secondary)',
                border: isCurrent ? '1px solid var(--brand-primary)' : '1px solid var(--border-default)',
              }}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isFetching}
          aria-label="Go to next page"
          title="Next page"
          style={{
            padding: '6px 8px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronRight size={15} />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages || isFetching}
          aria-label="Go to last page"
          title="Last page"
          style={{
            padding: '6px 8px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronsRight size={15} />
        </button>
      </div>

      {/* Right: Page size selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <label htmlFor="pageSize-select" style={{ color: 'var(--text-muted)' }}>
          Rows per page:
        </label>
        <select
          id="pageSize-select"
          aria-label="Number of rows per page"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          disabled={isFetching}
          style={{
            padding: '5px 8px',
            background: 'var(--bg-surface-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </nav>
  );
};

import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  searchQuery?: string;
  onReset: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, onReset }) => {
  return (
    <div
      role="region"
      aria-label="No results found"
      style={{
        padding: '5rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        background: 'var(--bg-surface)',
        gap: '1.25rem',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
        }}
      >
        <SearchX size={32} />
      </div>

      <div>
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.4rem',
          }}
        >
          No tickets found
        </h3>
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            maxWidth: '420px',
            lineHeight: 1.5,
          }}
        >
          {searchQuery
            ? `We couldn't find any tickets matching "${searchQuery}" with the active filters.`
            : 'No tickets match the selected combination of status, priority, and category.'}
        </p>
      </div>

      <button
        onClick={onReset}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '8px 18px',
          background: 'var(--brand-primary)',
          color: '#ffffff',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
          fontWeight: 600,
          boxShadow: '0 0 15px var(--brand-glow)',
        }}
      >
        <RotateCcw size={15} />
        <span>Clear all filters</span>
      </button>
    </div>
  );
};

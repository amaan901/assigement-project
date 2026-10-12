import React from 'react';

interface LoadingSkeletonProps {
  rows?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ rows = 10 }) => {
  return (
    <div
      aria-label="Loading tickets data"
      role="status"
      style={{
        padding: '1rem 2rem',
        background: 'var(--bg-surface)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
      }}
    >
      <span className="sr-only">Loading tickets from server, please wait...</span>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          style={{
            display: 'grid',
            gridTemplateColumns: '120px 2fr 1.2fr 100px 110px 100px 120px',
            alignItems: 'center',
            gap: '1rem',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            borderBottom: '1px solid var(--border-default)',
          }}
        >
          <div className="skeleton-box" style={{ height: '18px', width: '80%' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="skeleton-box" style={{ height: '16px', width: '90%' }} />
            <div className="skeleton-box" style={{ height: '12px', width: '60%' }} />
          </div>
          <div className="skeleton-box" style={{ height: '16px', width: '75%' }} />
          <div className="skeleton-box" style={{ height: '22px', width: '70px', borderRadius: '4px' }} />
          <div className="skeleton-box" style={{ height: '22px', width: '85px', borderRadius: '4px' }} />
          <div className="skeleton-box" style={{ height: '16px', width: '65%' }} />
          <div className="skeleton-box" style={{ height: '14px', width: '80%' }} />
        </div>
      ))}
    </div>
  );
};

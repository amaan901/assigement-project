import React from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
  onReset?: () => void;
  isRetrying?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  errorMessage,
  onRetry,
  onReset,
  isRetrying = false,
}) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        padding: '4rem 2rem',
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
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#dc2626',
        }}
      >
        <AlertTriangle size={32} />
      </div>

      <div style={{ maxWidth: '480px' }}>
        <h3
          style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#dc2626',
            marginBottom: '0.5rem',
          }}
        >
          Server Request Failed
        </h3>
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '0.5rem',
          }}
        >
          {errorMessage}
        </p>
        <p
          style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
          }}
        >
          Previous results were cleared to prevent displaying stale data as current.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
        <button
          onClick={onRetry}
          disabled={isRetrying}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '8px 20px',
            background: 'var(--brand-primary)',
            color: '#ffffff',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.86rem',
            fontWeight: 600,
            boxShadow: '0 2px 8px var(--brand-glow)',
          }}
        >
          <RefreshCw size={15} className={isRetrying ? 'animate-spin' : ''} />
          <span>{isRetrying ? 'Retrying...' : 'Retry Request'}</span>
        </button>

        {onReset && (
          <button
            onClick={onReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '8px 16px',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.86rem',
              fontWeight: 500,
            }}
          >
            <RotateCcw size={14} />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
};

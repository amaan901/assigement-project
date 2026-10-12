import { Database, Activity, Keyboard } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  isFetching: boolean;
  onOpenShortcuts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  isFetching,
  onOpenShortcuts,
}) => {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.25rem 2rem',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(17, 24, 39, 0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px var(--brand-glow)',
          }}
        >
          <Database size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
              }}
            >
              DataCore Explorer
            </h1>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: 'var(--bg-accent-subtle)',
                color: 'var(--border-focus)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              12,500 Records
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            High-throughput, race-condition resilient support ticket explorer
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Real-time status indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '6px 12px',
            background: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isFetching ? '#f59e0b' : '#10b981',
              boxShadow: isFetching ? '0 0 8px #f59e0b' : '0 0 8px #10b981',
              display: 'inline-block',
            }}
          />
          <span>{isFetching ? 'Fetching server...' : 'System synced'}</span>
        </div>

        {/* Total Dataset Pill */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}
          className="header-stat"
        >
          <Activity size={14} color="#818cf8" />
          <span>{totalCount.toLocaleString()} total tickets</span>
        </div>

        {/* Keyboard shortcuts trigger */}
        <button
          onClick={onOpenShortcuts}
          aria-label="View keyboard shortcuts"
          title="Press '?' for keyboard shortcuts"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '6px 12px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
          }}
        >
          <Keyboard size={15} />
          <span>Shortcuts</span>
          <kbd
            style={{
              background: 'var(--bg-app)',
              padding: '1px 5px',
              borderRadius: '4px',
              border: '1px solid var(--border-default)',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ?
          </kbd>
        </button>
      </div>
    </header>
  );
};

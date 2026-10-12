import React, { useState, useEffect } from 'react';
import {
  simulationSettings,
  telemetry,
  subscribeTelemetry,
} from '../api/mockApi';
import type { NetworkTelemetry } from '../types/ticket';
import {
  Zap,
  AlertTriangle,
  Radio,
  XCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface SimulationToolbarProps {
  onForceFail: () => void;
}

export const SimulationToolbar: React.FC<SimulationToolbarProps> = ({
  onForceFail,
}) => {
  const [stats, setStats] = useState<NetworkTelemetry>({ ...telemetry });
  const [latencyMode, setLatencyMode] = useState(simulationSettings.latencyMode);
  const [failureRate, setFailureRate] = useState(simulationSettings.failureRate);
  const [nextWillFail, setNextWillFail] = useState(simulationSettings.forceNextFail);

  useEffect(() => {
    return subscribeTelemetry((updated) => {
      setStats({ ...updated });
    });
  }, []);

  const handleLatencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as typeof latencyMode;
    simulationSettings.latencyMode = val;
    setLatencyMode(val);
  };

  const handleFailureRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseFloat(e.target.value);
    simulationSettings.failureRate = val;
    setFailureRate(val);
  };

  const handleTriggerFail = () => {
    simulationSettings.forceNextFail = true;
    setNextWillFail(true);
    onForceFail();
  };

  return (
    <aside
      aria-label="Network Simulation Controls & Real-time Telemetry"
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0.6rem 2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        fontSize: '0.8rem',
      }}
    >
      {/* Simulation Controls */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#818cf8', fontWeight: 600 }}>
          <Radio size={15} />
          <span>Network Simulator:</span>
        </div>

        {/* Latency dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <label htmlFor="sim-latency" style={{ color: 'var(--text-muted)' }}>
            Latency:
          </label>
          <select
            id="sim-latency"
            value={latencyMode}
            onChange={handleLatencyChange}
            style={{
              background: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              padding: '3px 8px',
              fontSize: '0.78rem',
            }}
          >
            <option value="random">Random 200ms - 3s (Assignment Spec)</option>
            <option value="fixed-slow">Slow (2,200ms)</option>
            <option value="fixed-fast">Fast (150ms)</option>
            <option value="zero">Zero (Instant 0ms)</option>
          </select>
        </div>

        {/* Failure rate dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <label htmlFor="sim-fail" style={{ color: 'var(--text-muted)' }}>
            Failure Rate:
          </label>
          <select
            id="sim-fail"
            value={failureRate.toString()}
            onChange={handleFailureRateChange}
            style={{
              background: 'var(--bg-surface-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-sm)',
              padding: '3px 8px',
              fontSize: '0.78rem',
            }}
          >
            <option value="0.1">10% Random (Assignment Spec)</option>
            <option value="0.25">25% (High Failure)</option>
            <option value="0">0% (Disabled)</option>
          </select>
        </div>

        {/* Force next fail CTA */}
        <button
          onClick={handleTriggerFail}
          title="Force the next network request to return HTTP 500 error"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '3px 10px',
            background: nextWillFail ? 'rgba(239, 68, 68, 0.25)' : 'var(--bg-surface-elevated)',
            border: nextWillFail ? '1px solid #ef4444' : '1px solid var(--border-default)',
            color: nextWillFail ? '#f87171' : 'var(--text-secondary)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.76rem',
            fontWeight: 500,
          }}
        >
          <AlertTriangle size={13} color={nextWillFail ? '#f87171' : '#f59e0b'} />
          <span>{nextWillFail ? 'Next request will fail!' : 'Force 500 Error'}</span>
        </button>
      </div>

      {/* Real-time Telemetry Counters */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          color: 'var(--text-muted)',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Telemetry:
        </span>

        {/* In-Flight Active Requests */}
        <div
          title="Active requests currently in flight"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            color: stats.activeRequests > 0 ? '#38bdf8' : 'var(--text-muted)',
          }}
        >
          <Zap size={13} />
          <span>Active: <strong>{stats.activeRequests}</strong></span>
        </div>

        {/* Aborted / Superseded Requests */}
        <div
          title="Superseded requests cancelled via AbortController / ignored"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            color: stats.abortedRequests > 0 ? '#f59e0b' : 'var(--text-muted)',
          }}
        >
          <XCircle size={13} />
          <span>Canceled: <strong>{stats.abortedRequests}</strong></span>
        </div>

        {/* Failed Requests */}
        <div
          title="Simulated network failures (1 in 10 requests)"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            color: stats.failedRequests > 0 ? '#f87171' : 'var(--text-muted)',
          }}
        >
          <AlertTriangle size={13} />
          <span>Failed: <strong>{stats.failedRequests}</strong></span>
        </div>

        {/* Completed Requests */}
        <div
          title="Total completed responses"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            color: stats.completedRequests > 0 ? '#34d399' : 'var(--text-muted)',
          }}
        >
          <CheckCircle2 size={13} />
          <span>Done: <strong>{stats.completedRequests}</strong></span>
        </div>

        {/* Last Latency */}
        {stats.lastLatencyMs !== null && (
          <div
            title="Simulated latency of the most recent request"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: 'var(--text-secondary)',
            }}
          >
            <Clock size={13} />
            <span>{stats.lastLatencyMs}ms</span>
          </div>
        )}
      </div>
    </aside>
  );
};

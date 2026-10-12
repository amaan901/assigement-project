import React, { useRef, useCallback } from 'react';
import type {
  Ticket,
  SortField,
  SortOrder,
  TicketPriority,
  TicketStatus,
} from '../types/ticket';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface TicketTableProps {
  tickets: Ticket[];
  sortBy: SortField;
  sortOrder: SortOrder;
  selectedId: string | null;
  onSortChange: (field: SortField) => void;
  onSelectTicket: (ticket: Ticket) => void;
  isFetching?: boolean;
}

export const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  sortBy,
  sortOrder,
  selectedId,
  onSortChange,
  onSelectTicket,
  isFetching,
}) => {
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTableRowElement>, index: number, ticket: Ticket) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelectTicket(ticket);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = Math.min(tickets.length - 1, index + 1);
        rowRefs.current[nextIndex]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = Math.max(0, index - 1);
        rowRefs.current[prevIndex]?.focus();
      }
    },
    [tickets, onSelectTicket]
  );

  const renderSortIcon = (field: SortField) => {
    if (sortBy !== field) {
      return <ArrowUpDown size={14} style={{ opacity: 0.3 }} />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={14} color="#4f46e5" />
    ) : (
      <ArrowDown size={14} color="#4f46e5" />
    );
  };

  const getAriaSort = (field: SortField): 'ascending' | 'descending' | 'none' => {
    if (sortBy !== field) return 'none';
    return sortOrder === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        overflowX: 'auto',
        background: 'var(--bg-surface)',
        padding: '0px 20px'
      }}
    >
      {isFetching && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #4f46e5, #9333ea, #4f46e5)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.2s infinite',
            zIndex: 30,
          }}
        />
      )}

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.86rem',
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: '1px solid var(--border-default)',
              background: 'var(--bg-surface-elevated)',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}
          >
            <th
              scope="col"
              aria-sort={getAriaSort('id')}
              style={{ padding: '12px 16px', width: '120px' }}
            >
              <button
                onClick={() => onSortChange('id')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  color: sortBy === 'id' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <span>Ticket ID</span>
                {renderSortIcon('id')}
              </button>
            </th>

            <th
              scope="col"
              aria-sort={getAriaSort('title')}
              style={{ padding: '12px 16px', minWidth: '320px' }}
            >
              <button
                onClick={() => onSortChange('title')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  color: sortBy === 'title' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <span>Title & Customer</span>
                {renderSortIcon('title')}
              </button>
            </th>

            <th
              scope="col"
              aria-sort={getAriaSort('category')}
              style={{ padding: '12px 16px', width: '180px' }}
            >
              <button
                onClick={() => onSortChange('category')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  color: sortBy === 'category' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <span>Category</span>
                {renderSortIcon('category')}
              </button>
            </th>

            <th
              scope="col"
              aria-sort={getAriaSort('priority')}
              style={{ padding: '12px 16px', width: '110px' }}
            >
              <button
                onClick={() => onSortChange('priority')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  color: sortBy === 'priority' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <span>Priority</span>
                {renderSortIcon('priority')}
              </button>
            </th>

            <th
              scope="col"
              aria-sort={getAriaSort('status')}
              style={{ padding: '12px 16px', width: '130px' }}
            >
              <button
                onClick={() => onSortChange('status')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  color: sortBy === 'status' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <span>Status</span>
                {renderSortIcon('status')}
              </button>
            </th>

            <th
              scope="col"
              aria-sort={getAriaSort('slaHoursRemaining')}
              style={{ padding: '12px 16px', width: '120px' }}
            >
              <button
                onClick={() => onSortChange('slaHoursRemaining')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  color: sortBy === 'slaHoursRemaining' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <span>SLA</span>
                {renderSortIcon('slaHoursRemaining')}
              </button>
            </th>

            <th
              scope="col"
              aria-sort={getAriaSort('createdAt')}
              style={{ padding: '12px 16px', width: '130px' }}
            >
              <button
                onClick={() => onSortChange('createdAt')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  color: sortBy === 'createdAt' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <span>Created</span>
                {renderSortIcon('createdAt')}
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((ticket, idx) => {
            const isSelected = selectedId === ticket.id;
            return (
              <tr
                key={ticket.id}
                ref={(el) => {
                  rowRefs.current[idx] = el;
                }}
                tabIndex={0}
                role="row"
                aria-selected={isSelected}
                onClick={() => onSelectTicket(ticket)}
                onKeyDown={(e) => handleKeyDown(e, idx, ticket)}
                style={{
                  borderBottom: '1px solid var(--border-default)',
                  cursor: 'pointer',
                  background: isSelected
                    ? 'rgba(79, 70, 229, 0.08)'
                    : 'transparent',
                  transition: 'background-color 0.1s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <td style={{ padding: '14px 16px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  <span
                    style={{
                      color: isSelected ? '#4338ca' : '#4f46e5',
                    }}
                  >
                    {ticket.id}
                  </span>
                </td>

                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {ticket.title}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <span>{ticket.customer.name}</span>
                      <span>•</span>
                      <span>{ticket.customer.organization}</span>
                      {ticket.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            background: 'var(--bg-surface-elevated)',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-default)',
                            fontSize: '0.72rem',
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </td>

                <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                  {ticket.category}
                </td>

                <td style={{ padding: '14px 16px' }}>
                  <PriorityBadge priority={ticket.priority} />
                </td>

                <td style={{ padding: '14px 16px' }}>
                  <StatusBadge status={ticket.status} />
                </td>

                <td style={{ padding: '14px 16px' }}>
                  <SlaBadge hours={ticket.slaHoursRemaining} />
                </td>

                <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const PriorityBadge: React.FC<{ priority: TicketPriority }> = ({ priority }) => {
  let bg = 'var(--priority-low-bg)';
  let color = 'var(--priority-low-text)';
  let border = 'var(--priority-low-border)';

  if (priority === 'Urgent') {
    bg = 'var(--priority-urgent-bg)';
    color = 'var(--priority-urgent-text)';
    border = 'var(--priority-urgent-border)';
  } else if (priority === 'High') {
    bg = 'var(--priority-high-bg)';
    color = 'var(--priority-high-text)';
    border = 'var(--priority-high-border)';
  } else if (priority === 'Medium') {
    bg = 'var(--priority-medium-bg)';
    color = 'var(--priority-medium-text)';
    border = 'var(--priority-medium-border)';
  }

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 8px',
        borderRadius: 'var(--radius-sm)',
        background: bg,
        color: color,
        border: `1px solid ${border}`,
        fontSize: '0.75rem',
        fontWeight: 600,
      }}
    >
      {priority}
    </span>
  );
};

const StatusBadge: React.FC<{ status: TicketStatus }> = ({ status }) => {
  let bg = 'var(--status-open-bg)';
  let color = 'var(--status-open-text)';

  if (status === 'In Progress') {
    bg = 'var(--status-inprogress-bg)';
    color = 'var(--status-inprogress-text)';
  } else if (status === 'Under Review') {
    bg = 'var(--status-review-bg)';
    color = 'var(--status-review-text)';
  } else if (status === 'Resolved') {
    bg = 'var(--status-resolved-bg)';
    color = 'var(--status-resolved-text)';
  } else if (status === 'Closed') {
    bg = 'var(--status-closed-bg)';
    color = 'var(--status-closed-text)';
  }

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 8px',
        borderRadius: 'var(--radius-sm)',
        background: bg,
        color: color,
        fontSize: '0.75rem',
        fontWeight: 500,
      }}
    >
      {status}
    </span>
  );
};

const SlaBadge: React.FC<{ hours: number }> = ({ hours }) => {
  const isBreached = hours <= 0;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.76rem',
        color: isBreached ? '#dc2626' : hours < 12 ? '#d97706' : 'var(--text-secondary)',
        fontWeight: isBreached ? 600 : 400,
      }}
    >
      {isBreached ? <AlertCircle size={12} color="#dc2626" /> : <Clock size={12} />}
      <span>{isBreached ? 'Breached' : `${hours}h`}</span>
    </span>
  );
};

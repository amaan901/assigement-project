import { generateTickets } from '../data/generator';
import type {
  Ticket,
  TicketFilters,
  TicketApiResponse,
  SimulationSettings,
  NetworkTelemetry,
  TicketPriority,
} from '../types/ticket';

let cachedTickets: Ticket[] | null = null;
export function getDataset(): Ticket[] {
  if (!cachedTickets) {
    cachedTickets = generateTickets(12500);
  }
  return cachedTickets;
}

export const simulationSettings: SimulationSettings = {
  latencyMode: 'random',
  failureRate: 0.1,
  forceNextFail: false,
};

export const telemetry: NetworkTelemetry = {
  activeRequests: 0,
  completedRequests: 0,
  abortedRequests: 0,
  failedRequests: 0,
  lastLatencyMs: null,
};

type TelemetryListener = (stats: NetworkTelemetry) => void;
const listeners = new Set<TelemetryListener>();

export function subscribeTelemetry(listener: TelemetryListener) {
  listeners.add(listener);
  listener({ ...telemetry });
  return () => {
    listeners.delete(listener);
  };
}

function notifyTelemetry() {
  const snapshot = { ...telemetry };
  listeners.forEach((l) => l(snapshot));
}

const PRIORITY_WEIGHTS: Record<TicketPriority, number> = {
  Urgent: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

function calculateLatency(): number {
  switch (simulationSettings.latencyMode) {
    case 'zero':
      return 0;
    case 'fixed-fast':
      return 150;
    case 'fixed-slow':
      return 2200;
    case 'random':
    default:
      return Math.floor(Math.random() * (3000 - 200 + 1)) + 200;
  }
}

function simulateNetworkDelay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      telemetry.abortedRequests++;
      notifyTelemetry();
      return reject(new DOMException('The user aborted a request.', 'AbortError'));
    }

    if (ms <= 0) {
      return resolve();
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const onAbort = () => {
      if (timeoutId) clearTimeout(timeoutId);
      telemetry.abortedRequests++;
      notifyTelemetry();
      reject(new DOMException('The user aborted a request.', 'AbortError'));
    };

    timeoutId = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

export async function fetchTickets(
  filters: TicketFilters,
  signal?: AbortSignal
): Promise<TicketApiResponse> {
  telemetry.activeRequests++;
  notifyTelemetry();

  const latencyMs = calculateLatency();
  telemetry.lastLatencyMs = latencyMs;

  try {
    await simulateNetworkDelay(latencyMs, signal);

    const shouldFail =
      simulationSettings.forceNextFail ||
      Math.random() < simulationSettings.failureRate;

    if (simulationSettings.forceNextFail) {
      simulationSettings.forceNextFail = false;
    }

    if (shouldFail) {
      telemetry.failedRequests++;
      throw new Error(
        'Server Error 500: Database connection timeout (Simulated 1 in 10 request failure). Please retry.'
      );
    }

    const dataset = getDataset();

    let results = dataset;

    if (filters.q && filters.q.trim()) {
      const query = filters.q.trim().toLowerCase();
      results = results.filter((ticket) => {
        return (
          ticket.id.toLowerCase().includes(query) ||
          ticket.title.toLowerCase().includes(query) ||
          ticket.customer.name.toLowerCase().includes(query) ||
          ticket.customer.email.toLowerCase().includes(query) ||
          ticket.customer.organization.toLowerCase().includes(query) ||
          ticket.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      });
    }

    if (filters.status && filters.status !== 'all') {
      results = results.filter((ticket) => ticket.status === filters.status);
    }

    if (filters.priority && filters.priority !== 'all') {
      results = results.filter((ticket) => ticket.priority === filters.priority);
    }

    if (filters.category && filters.category !== 'all') {
      results = results.filter((ticket) => ticket.category === filters.category);
    }

    const statusCounts = {
      Open: 0,
      'In Progress': 0,
      'Under Review': 0,
      Resolved: 0,
      Closed: 0,
    };
    for (const item of results) {
      statusCounts[item.status]++;
    }

    const { sortBy, sortOrder } = filters;
    const isAsc = sortOrder === 'asc';

    results = [...results].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'id':
          comparison = a.id.localeCompare(b.id, undefined, { numeric: true });
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'priority':
          comparison = PRIORITY_WEIGHTS[a.priority] - PRIORITY_WEIGHTS[b.priority];
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'slaHoursRemaining':
          comparison = a.slaHoursRemaining - b.slaHoursRemaining;
          break;
        default:
          comparison = 0;
      }
      return isAsc ? comparison : -comparison;
    });

    const total = results.length;
    const page = Math.max(1, filters.page);
    const pageSize = Math.max(1, filters.pageSize);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const startIndex = (page - 1) * pageSize;
    const paginatedData = results.slice(startIndex, startIndex + pageSize);

    telemetry.completedRequests++;
    return {
      data: paginatedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages,
        statusCounts,
      },
    };
  } finally {
    telemetry.activeRequests = Math.max(0, telemetry.activeRequests - 1);
    notifyTelemetry();
  }
}

export async function fetchTicketById(id: string, signal?: AbortSignal): Promise<Ticket | null> {
  const latency = Math.min(calculateLatency(), 600);
  await simulateNetworkDelay(latency, signal);
  const dataset = getDataset();
  return dataset.find((t) => t.id === id) || null;
}

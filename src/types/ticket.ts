export type TicketPriority = 'Urgent' | 'High' | 'Medium' | 'Low';

export type TicketStatus = 'Open' | 'In Progress' | 'Under Review' | 'Resolved' | 'Closed';

export type TicketCategory =
  | 'Billing & Payments'
  | 'Authentication & SSO'
  | 'Infrastructure & DevOps'
  | 'API & Webhooks'
  | 'Feature Request'
  | 'Security & Compliance';

export interface TicketCustomer {
  name: string;
  email: string;
  organization: string;
  avatarUrl?: string;
}

export interface TicketAssignee {
  name: string;
  email: string;
  initials: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  customer: TicketCustomer;
  assignee: TicketAssignee;
  createdAt: string;
  updatedAt: string;
  slaHoursRemaining: number;
  tags: string[];
  resolutionNotes?: string;
}

export type SortField = 'id' | 'title' | 'priority' | 'status' | 'category' | 'createdAt' | 'slaHoursRemaining';
export type SortOrder = 'asc' | 'desc';

export interface TicketFilters {
  q: string;
  status: string;
  priority: string;
  category: string;
  sortBy: SortField;
  sortOrder: SortOrder;
  page: number;
  pageSize: number;
}

export interface TicketApiResponse {
  data: Ticket[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    statusCounts: Record<TicketStatus, number>;
  };
}

export interface SimulationSettings {
  latencyMode: 'random' | 'fixed-fast' | 'fixed-slow' | 'zero';
  failureRate: number;
  forceNextFail: boolean;
}

export interface NetworkTelemetry {
  activeRequests: number;
  completedRequests: number;
  abortedRequests: number;
  failedRequests: number;
  lastLatencyMs: number | null;
}

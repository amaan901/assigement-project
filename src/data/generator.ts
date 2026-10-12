import type {
  Ticket,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  TicketAssignee,
  TicketCustomer,
} from '../types/ticket';

function createSeededRandom(seed: number) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST_NAMES = [
  'Sophia', 'Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Ava', 'Elijah',
  'Charlotte', 'William', 'Amelia', 'James', 'Harper', 'Benjamin', 'Evelyn',
  'Lucas', 'Abigail', 'Henry', 'Emily', 'Alexander', 'Elizabeth', 'Mason',
  'Mila', 'Michael', 'Ella', 'Ethan', 'Avery', 'Daniel', 'Scarlett', 'Matthew',
  'Chloe', 'Aiden', 'Camila', 'Jackson', 'Penelope', 'David', 'Luna', 'Sebastian'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker'
];

const COMPANIES = [
  'Acme Cloud', 'Stripe', 'Linear Systems', 'Vercel Labs', 'Shopify Plus',
  'Datadog Inc', 'Snowflake', 'Figma Design', 'Supabase Core', 'Retool Ops',
  'Cloudflare Edge', 'Tailscale Net', 'Notion Labs', 'PagerDuty Corp', 'Twilio API',
  'HashiCorp', 'MongoDB Atlas', 'Elastic Search', 'GitLab DevOps', 'Sentry IO'
];

const ASSIGNEES: TicketAssignee[] = [
  { name: 'Elena Rostova', email: 'elena.r@support.internal', initials: 'ER' },
  { name: 'Marcus Chen', email: 'marcus.c@support.internal', initials: 'MC' },
  { name: 'Sarah Jenkins', email: 'sarah.j@support.internal', initials: 'SJ' },
  { name: 'David Kim', email: 'david.k@support.internal', initials: 'DK' },
  { name: 'Amara Patel', email: 'amara.p@support.internal', initials: 'AP' },
  { name: 'Lucas Rossi', email: 'lucas.r@support.internal', initials: 'LR' },
  { name: 'Zoe Washington', email: 'zoe.w@support.internal', initials: 'ZW' },
];

const CATEGORIES: TicketCategory[] = [
  'Billing & Payments',
  'Authentication & SSO',
  'Infrastructure & DevOps',
  'API & Webhooks',
  'Feature Request',
  'Security & Compliance',
];

const TEMPLATES: Record<TicketCategory, string[]> = {
  'Billing & Payments': [
    'Subscription upgrade failed with invoice payment intent 402',
    'VAT identification number validation error on checkout',
    'Duplicate charge reported for invoice renewal #INV-8821',
    'Credit card auto-charge failed during billing cycle transition',
    'Usage-based tier calculation mismatch on enterprise plan',
    'Refund request pending approval for canceled seat license',
    'Stripe webhook callback returning HTTP 504 during bulk invoice run',
  ],
  'Authentication & SSO': [
    'SAML 2.0 assertion signature verification failing with Okta',
    'OAuth2 PKCE authorization code exchange timing out on Safari iOS',
    'Two-factor TOTP authentication codes rejected after time sync error',
    'SCIM user provisioning endpoint throwing 409 duplicate email',
    'Session expiration cookie missing SameSite=None secure attribute',
    'Azure AD enterprise directory sync stopped synchronizing groups',
    'Magic link authentication token expired prematurely',
  ],
  'Infrastructure & DevOps': [
    'PostgreSQL read replica replication lag exceeding 180 seconds',
    'Kubernetes pod crashlooping due to OOMKilled in worker pod',
    'Redis cluster node failover triggered unexpected client disconnects',
    'CloudFront CDN edge cache serving stale gzip responses',
    'High CPU utilization alert triggered on API gateway ingress',
    'Docker container image build failure on ARM64 runner',
    'Logstash daemon unable to flush to Elasticsearch cluster',
  ],
  'API & Webhooks': [
    'GraphQL mutation returning null for non-nullable nested relation',
    'REST API v2 rate limiter triggering before quota threshold',
    'Webhook delivery failing with TLS handshake timeout',
    'Batch export endpoint truncating JSON responses over 50MB',
    'CORS preflight OPTIONS request rejected on staging subdomain',
    'Pagination cursor invalid error when fetching page > 100',
    'Missing idempotent key handling causing duplicate resource creation',
  ],
  'Feature Request': [
    'Request for custom domain SSL certificate upload support',
    'Add webhook event notification for audit log exports',
    'Allow role-based granular permissions for billing read-only view',
    'Support dark mode auto-detection in embedded iframe widget',
    'CSV export capability with custom delimiter and column ordering',
    'Multi-tenant workspace organization switching without re-login',
    'Request for OpenAPI 3.1 specification export from dashboard',
  ],
  'Security & Compliance': [
    'SOC 2 Type II audit report requested for enterprise onboarding',
    'Penetration test finding: Strict-Transport-Security header max-age',
    'GDPR right-to-be-forgotten automated erasure request received',
    'Subprocessor list update notification inquiry from compliance team',
    'Content Security Policy (CSP) report-uri receiving script violations',
    'Vulnerability notification for transitive dependency in client SDK',
    'Data residency compliance check for EU Frankfurt datacenter',
  ],
};

const TAG_POOL = [
  'enterprise', 'p1-critical', 'sla-risk', 'prod-down', 'customer-escalation',
  'api-v2', 'billing', 'auth', 'database', 'frontend', 'security', 'compliance',
  'webhook', 'mobile', 'safari', 'high-priority', 'regression', 'reviewed'
];

export function generateTickets(count = 12500): Ticket[] {
  const random = createSeededRandom(42);
  const tickets: Ticket[] = [];

  const now = new Date('2026-10-12T08:00:00Z').getTime();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const ONE_YEAR = 365 * ONE_DAY;

  for (let i = 1; i <= count; i++) {
    const idNum = 10000 + i;
    const id = `TCK-${idNum}`;

    const catIndex = Math.floor(random() * CATEGORIES.length);
    const category = CATEGORIES[catIndex];

    const templates = TEMPLATES[category];
    const templateIndex = Math.floor(random() * templates.length);
    const baseTitle = templates[templateIndex];

    const companyIndex = Math.floor(random() * COMPANIES.length);
    const company = COMPANIES[companyIndex];
    const title = `[${company}] ${baseTitle}`;

    const firstName = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)];
    const customer: TicketCustomer = {
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      organization: company,
    };

    const pRoll = random();
    const priority: TicketPriority =
      pRoll < 0.12 ? 'Urgent' :
      pRoll < 0.38 ? 'High' :
      pRoll < 0.75 ? 'Medium' : 'Low';

    const sRoll = random();
    const status: TicketStatus =
      sRoll < 0.28 ? 'Open' :
      sRoll < 0.52 ? 'In Progress' :
      sRoll < 0.68 ? 'Under Review' :
      sRoll < 0.88 ? 'Resolved' : 'Closed';

    const assignee = ASSIGNEES[Math.floor(random() * ASSIGNEES.length)];

    const createdOffset = Math.floor(random() * ONE_YEAR);
    const createdTime = now - createdOffset;
    const updatedTime = createdTime + Math.floor(random() * (now - createdTime));
    const createdAt = new Date(createdTime).toISOString();
    const updatedAt = new Date(updatedTime).toISOString();

    const slaBase = priority === 'Urgent' ? 8 : priority === 'High' ? 24 : priority === 'Medium' ? 48 : 96;
    const elapsedHours = (now - createdTime) / (1000 * 60 * 60);
    const slaHoursRemaining = Number((slaBase - (elapsedHours % (slaBase * 2))).toFixed(1));

    const numTags = 2 + Math.floor(random() * 3);
    const tagSet = new Set<string>();
    if (priority === 'Urgent') tagSet.add('sla-risk');
    while (tagSet.size < numTags) {
      tagSet.add(TAG_POOL[Math.floor(random() * TAG_POOL.length)]);
    }
    const tags = Array.from(tagSet);

    const description = `Issue reported by ${customer.name} (${customer.organization}):

${baseTitle}. 

Impact analysis: Affecting production traffic and customer operations. Diagnostic logs indicate intermittent failure on upstream services. We have assigned this ticket to ${assignee.name} for immediate investigation.

Environment:
- Organization: ${company}
- Account Tier: Enterprise SLA
- Client SDK: v4.12.0
- Region: us-east-1 / eu-central-1`;

    const resolutionNotes = status === 'Resolved' || status === 'Closed'
      ? `Resolved on ${new Date(updatedTime).toLocaleDateString()}: Root cause identified and hotfix deployed. Confirmed fix with customer.`
      : undefined;

    tickets.push({
      id,
      title,
      description,
      status,
      priority,
      category,
      customer,
      assignee,
      createdAt,
      updatedAt,
      slaHoursRemaining,
      tags,
      resolutionNotes,
    });
  }

  return tickets;
}

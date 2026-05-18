export const normalizedStatuses = [
  "not_started",
  "in_progress",
  "review",
  "waiting_client",
  "blocked",
  "done",
] as const;

export type NormalizedStatus = (typeof normalizedStatuses)[number];

export type DashboardTask = {
  id: string;
  title: string;
  normalizedStatus: NormalizedStatus;
  rawStatus: string;
  priority?: "urgent" | "high" | "normal" | "low";
  dueDate?: string;
  updatedAt: string;
  doneAt?: string;
  ownerLabel: "PulpSense" | "Client" | "Shared";
  publicSummary?: string;
  clientNeedsAction: boolean;
  blockedReason?: string;
};

export type ClientDashboard = {
  clientSlug: string;
  clientName: string;
  snapshotUpdatedAt: string;
  tasks: DashboardTask[];
};

export type DashboardSummary = {
  total: number;
  done: number;
  active: number;
  blocked: number;
  waitingOnClient: number;
  completionRate: number;
};

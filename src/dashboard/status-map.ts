import type { NormalizedStatus } from "@/dashboard/types";

export const statusMapIds = ["defaultDelivery", "redomiciledDelivery"] as const;

export type StatusMapId = (typeof statusMapIds)[number];
export type StatusMap = Readonly<Record<string, NormalizedStatus>>;

const defaultDeliveryStatusMap = {
  backlog: "not_started",
  idea: "not_started",
  ideas: "not_started",
  queue: "not_started",
  queued: "not_started",
  scoped: "not_started",
  "not started": "not_started",
  "to do": "not_started",
  todo: "not_started",

  active: "in_progress",
  building: "in_progress",
  doing: "in_progress",
  implementation: "in_progress",
  "in progress": "in_progress",
  progress: "in_progress",

  "client review": "review",
  "in review": "review",
  qa: "review",
  review: "review",
  "ready for review": "review",

  "awaiting client": "waiting_client",
  "blocked by client": "waiting_client",
  "client action": "waiting_client",
  "needs client": "waiting_client",
  "pending client": "waiting_client",
  "pending review": "waiting_client",
  waiting: "waiting_client",
  "waiting client": "waiting_client",
  "waiting for client": "waiting_client",
  "waiting on client": "waiting_client",

  blocked: "blocked",
  "on hold": "blocked",
  stuck: "blocked",

  closed: "done",
  complete: "done",
  completed: "done",
  done: "done",
  resolved: "done",
  shipped: "done",
} satisfies StatusMap;

const redomiciledDeliveryStatusMap = {
  ...defaultDeliveryStatusMap,
  "clickup setup": "in_progress",
  "content migration": "in_progress",
  "onboarding automation": "in_progress",
  "sales routing": "in_progress",
  "skool migration": "in_progress",
} satisfies StatusMap;

export const statusMaps = {
  defaultDelivery: defaultDeliveryStatusMap,
  redomiciledDelivery: redomiciledDeliveryStatusMap,
} satisfies Record<StatusMapId, StatusMap>;

export function normalizeStatusName(status: string): string {
  return status
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");
}

export function mapClickUpStatus(
  rawStatus: string | undefined,
  statusMapId: StatusMapId,
  fallback: NormalizedStatus = "in_progress",
): NormalizedStatus {
  const normalizedStatusName = normalizeStatusName(rawStatus ?? "");

  if (!normalizedStatusName) {
    return fallback;
  }

  const statusMap: StatusMap = statusMaps[statusMapId];

  return (
    statusMap[normalizedStatusName] ??
    inferStatusFromLabel(normalizedStatusName) ??
    fallback
  );
}

function inferStatusFromLabel(
  normalizedStatusName: string,
): NormalizedStatus | undefined {
  if (normalizedStatusName.includes("client")) {
    return "waiting_client";
  }

  if (normalizedStatusName.includes("block")) {
    return "blocked";
  }

  if (
    normalizedStatusName.includes("review") ||
    normalizedStatusName.includes("qa")
  ) {
    return "review";
  }

  if (
    normalizedStatusName.includes("done") ||
    normalizedStatusName.includes("complete") ||
    normalizedStatusName.includes("closed")
  ) {
    return "done";
  }

  if (
    normalizedStatusName.includes("queue") ||
    normalizedStatusName.includes("todo") ||
    normalizedStatusName.includes("backlog") ||
    normalizedStatusName.includes("idea")
  ) {
    return "not_started";
  }

  return undefined;
}

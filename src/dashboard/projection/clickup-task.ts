import type { ClickUpTask } from "@/clickup/schemas";
import type { DashboardClientConfig } from "@/config/clients";
import { getNormalizedTagNames } from "@/dashboard/projection/clickup-fields";
import {
  getStringCustomField,
  hasTruthyCustomField,
} from "@/dashboard/projection/clickup-fields";
import { shouldHideClickUpTask } from "@/dashboard/projection/hide-rules";
import { mapClickUpStatus, normalizeStatusName } from "@/dashboard/status-map";
import type { DashboardTask, NormalizedStatus } from "@/dashboard/types";

type ProjectionOptions = {
  client: DashboardClientConfig;
  fallbackUpdatedAt: string;
};

const publicSummaryFieldNames = [
  "Public Summary",
  "Client Summary",
  "Dashboard Summary",
];
const blockedReasonFieldNames = ["Blocked Reason", "Client Blocker", "Blocker"];
const ownerFieldNames = ["Dashboard Owner", "Public Owner", "Owner"];
const clientActionFieldNames = [
  "Client Action?",
  "Client Needs Action?",
  "Waiting On Client?",
];

export function projectClickUpTasks(
  tasks: readonly ClickUpTask[],
  options: ProjectionOptions,
): DashboardTask[] {
  return tasks
    .map((task) => projectClickUpTask(task, options))
    .filter((task): task is DashboardTask => task !== null)
    .sort(compareProjectedTasks);
}

export function projectClickUpTask(
  task: ClickUpTask,
  { client, fallbackUpdatedAt }: ProjectionOptions,
): DashboardTask | null {
  if (shouldHideClickUpTask(task)) {
    return null;
  }

  const rawStatus = task.status?.status ?? "unknown";
  const normalizedStatus = mapClickUpStatus(rawStatus, client.statusMapId);
  const updatedAt = timestampToIso(task.date_updated) ?? fallbackUpdatedAt;
  const doneAt = timestampToIso(task.date_done);
  const title = sanitizeText(task.name, 160) ?? "Untitled task";
  const publicSummary = getStringCustomField(task, publicSummaryFieldNames);
  const blockedReason = getStringCustomField(task, blockedReasonFieldNames);

  return {
    id: task.id,
    title,
    normalizedStatus,
    isIdea: isIdeaStatus(rawStatus),
    priority: normalizePriority(task.priority?.priority),
    dueDate: timestampToDate(task.due_date),
    updatedAt,
    doneAt: normalizedStatus === "done" ? (doneAt ?? updatedAt) : doneAt,
    ownerLabel: getOwnerLabel(task, normalizedStatus),
    publicSummary,
    clientNeedsAction: getClientNeedsAction(task, normalizedStatus),
    blockedReason: normalizedStatus === "blocked" ? blockedReason : undefined,
  };
}

function isIdeaStatus(rawStatus: string): boolean {
  const normalizedStatus = normalizeStatusName(rawStatus);

  return (
    normalizedStatus.includes("idea") ||
    normalizedStatus.includes("backlog") ||
    normalizedStatus.includes("scoped")
  );
}

function getClientNeedsAction(
  task: ClickUpTask,
  normalizedStatus: NormalizedStatus,
): boolean {
  if (normalizedStatus === "waiting_client") {
    return true;
  }

  const tagNames = getNormalizedTagNames(task);

  return (
    tagNames.some((tagName) =>
      ["client action", "client needed", "waiting client"].includes(tagName),
    ) || hasTruthyCustomField(task, clientActionFieldNames)
  );
}

function getOwnerLabel(
  task: ClickUpTask,
  normalizedStatus: NormalizedStatus,
): DashboardTask["ownerLabel"] {
  if (normalizedStatus === "waiting_client") {
    return "Client";
  }

  const owner = getStringCustomField(task, ownerFieldNames, 80)?.toLowerCase();

  if (owner?.includes("client")) {
    return "Client";
  }

  if (owner?.includes("shared")) {
    return "Shared";
  }

  const tagNames = getNormalizedTagNames(task);

  if (tagNames.includes("shared")) {
    return "Shared";
  }

  if (tagNames.includes("client")) {
    return "Client";
  }

  return "PulpSense";
}

function normalizePriority(
  priority: string | number | undefined,
): DashboardTask["priority"] {
  const normalizedPriority = String(priority ?? "")
    .trim()
    .toLowerCase();

  if (
    normalizedPriority === "urgent" ||
    normalizedPriority === "high" ||
    normalizedPriority === "normal" ||
    normalizedPriority === "low"
  ) {
    return normalizedPriority;
  }

  return undefined;
}

function timestampToIso(
  value: string | number | null | undefined,
): string | undefined {
  const date = timestampToDateObject(value);
  return date?.toISOString();
}

function timestampToDate(
  value: string | number | null | undefined,
): string | undefined {
  const date = timestampToDateObject(value);
  return date?.toISOString().slice(0, 10);
}

function timestampToDateObject(
  value: string | number | null | undefined,
): Date | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  const numericValue = Number(value);
  const timestamp = Number.isFinite(numericValue)
    ? numericValue
    : Date.parse(String(value));
  const date = new Date(timestamp);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

function sanitizeText(value: string, maxLength: number): string | undefined {
  const normalized = value.trim().replace(/\s+/g, " ");

  if (!normalized) {
    return undefined;
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}...`;
}

function compareProjectedTasks(a: DashboardTask, b: DashboardTask): number {
  const statusRank =
    getStatusRank(a.normalizedStatus) - getStatusRank(b.normalizedStatus);

  if (statusRank !== 0) {
    return statusRank;
  }

  return b.updatedAt.localeCompare(a.updatedAt);
}

function getStatusRank(status: NormalizedStatus): number {
  const rank: Record<NormalizedStatus, number> = {
    blocked: 0,
    waiting_client: 1,
    in_progress: 2,
    review: 3,
    not_started: 4,
    done: 5,
  };

  return rank[status];
}

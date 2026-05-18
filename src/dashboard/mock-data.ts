import type { ClientDashboard } from "@/dashboard/types";

const now = "2026-05-18T14:00:00.000Z";

export const demoDashboard = {
  clientSlug: "demo",
  clientName: "Demo Client",
  snapshotUpdatedAt: now,
  tasks: [
    {
      id: "task-1",
      title: "Confirm client-visible project milestones",
      normalizedStatus: "waiting_client",
      rawStatus: "pending review",
      priority: "high",
      dueDate: "2026-05-20",
      updatedAt: "2026-05-18T13:45:00.000Z",
      ownerLabel: "Client",
      publicSummary:
        "Waiting for confirmation on the milestone labels shown in the dashboard.",
      clientNeedsAction: true,
      source: {
        clientSlug: "demo",
        listId: "demo-list",
        taskId: "task-1",
      },
    },
    {
      id: "task-2",
      title: "Build read-only ClickUp snapshot",
      normalizedStatus: "in_progress",
      rawStatus: "in progress",
      priority: "urgent",
      dueDate: "2026-05-22",
      updatedAt: "2026-05-18T12:30:00.000Z",
      ownerLabel: "PulpSense",
      publicSummary:
        "Creating the first server-side projection from ClickUp data.",
      clientNeedsAction: false,
      source: {
        clientSlug: "demo",
        listId: "demo-list",
        taskId: "task-2",
      },
    },
    {
      id: "task-3",
      title: "Review visibility rules for internal tasks",
      normalizedStatus: "review",
      rawStatus: "review",
      priority: "normal",
      updatedAt: "2026-05-18T10:00:00.000Z",
      ownerLabel: "Shared",
      publicSummary:
        "Checking that internal-only work cannot appear in client routes.",
      clientNeedsAction: false,
      source: {
        clientSlug: "demo",
        listId: "demo-list",
        taskId: "task-3",
      },
    },
    {
      id: "task-4",
      title: "Resolve ClickUp field naming mismatch",
      normalizedStatus: "blocked",
      rawStatus: "blocked",
      priority: "high",
      updatedAt: "2026-05-17T20:15:00.000Z",
      ownerLabel: "PulpSense",
      publicSummary:
        "Blocked until the dashboard has a stable source field for public summaries.",
      clientNeedsAction: false,
      blockedReason: "Needs field decision",
      source: {
        clientSlug: "demo",
        listId: "demo-list",
        taskId: "task-4",
      },
    },
    {
      id: "task-5",
      title: "Publish initial dashboard shell",
      normalizedStatus: "done",
      rawStatus: "complete",
      priority: "normal",
      updatedAt: "2026-05-16T19:20:00.000Z",
      doneAt: "2026-05-16T19:20:00.000Z",
      ownerLabel: "PulpSense",
      publicSummary: "The first dashboard shell is ready for internal review.",
      clientNeedsAction: false,
      source: {
        clientSlug: "demo",
        listId: "demo-list",
        taskId: "task-5",
      },
    },
  ],
} satisfies ClientDashboard;

export function getDemoDashboard(clientSlug: string): ClientDashboard {
  return {
    ...demoDashboard,
    clientSlug,
    clientName: clientSlug === "demo" ? "Demo Client" : clientSlug,
    tasks: demoDashboard.tasks.map((task) => ({
      ...task,
      source: {
        ...task.source,
        clientSlug,
      },
    })),
  };
}

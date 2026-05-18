import type { DashboardSummary, DashboardTask } from "@/dashboard/types";

export function getDashboardSummary(
  tasks: readonly DashboardTask[],
): DashboardSummary {
  const done = tasks.filter((task) => task.normalizedStatus === "done").length;
  const blocked = tasks.filter(
    (task) => task.normalizedStatus === "blocked",
  ).length;
  const waitingOnClient = tasks.filter((task) => task.clientNeedsAction).length;
  const active = tasks.filter((task) =>
    ["in_progress", "review", "waiting_client", "blocked"].includes(
      task.normalizedStatus,
    ),
  ).length;

  return {
    total: tasks.length,
    done,
    active,
    blocked,
    waitingOnClient,
    completionRate:
      tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100),
  };
}

export function getTasksByStatus(
  tasks: readonly DashboardTask[],
  status: DashboardTask["normalizedStatus"],
) {
  return tasks.filter((task) => task.normalizedStatus === status);
}

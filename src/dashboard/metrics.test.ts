import { describe, expect, it } from "vitest";
import { demoDashboard } from "@/dashboard/mock-data";
import { getDashboardSummary, getTasksByStatus } from "@/dashboard/metrics";

describe("dashboard metrics", () => {
  it("summarizes projected task state", () => {
    expect(getDashboardSummary(demoDashboard.tasks)).toEqual({
      total: 5,
      done: 1,
      active: 4,
      blocked: 1,
      waitingOnClient: 1,
      completionRate: 20,
    });
  });

  it("filters tasks by normalized status", () => {
    const blocked = getTasksByStatus(demoDashboard.tasks, "blocked");

    expect(blocked).toHaveLength(1);
    expect(blocked[0]?.title).toBe("Resolve ClickUp field naming mismatch");
  });
});

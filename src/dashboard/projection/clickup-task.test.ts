import { describe, expect, it } from "vitest";
import { parseClickUpTask } from "@/clickup/schemas";
import { dashboardClientConfig } from "@/config/clients";
import {
  projectClickUpTask,
  projectClickUpTasks,
} from "@/dashboard/projection/clickup-task";

const fallbackUpdatedAt = "2026-05-22T12:00:00.000Z";

describe("ClickUp task projection", () => {
  it("projects only client-safe allowlisted fields", () => {
    const task = parseClickUpTask({
      id: "86abc",
      name: " Publish  client milestone summary ",
      description: "secret implementation notes",
      assignees: [{ email: "private@example.com" }],
      status: { status: "in progress" },
      priority: { priority: "urgent" },
      due_date: String(Date.parse("2026-05-25T00:00:00.000Z")),
      date_updated: String(Date.parse("2026-05-22T11:00:00.000Z")),
      tags: [{ name: "Delivery" }],
      custom_fields: [
        { name: "Public Summary", value: "Safe client-facing summary." },
        { name: "Owner", value: "Shared" },
      ],
    });

    const projected = projectClickUpTask(task, {
      client: dashboardClientConfig.autopilot,
      fallbackUpdatedAt,
    });

    expect(projected).toEqual({
      id: "86abc",
      title: "Publish client milestone summary",
      normalizedStatus: "in_progress",
      isIdea: false,
      priority: "urgent",
      dueDate: "2026-05-25",
      updatedAt: "2026-05-22T11:00:00.000Z",
      doneAt: undefined,
      ownerLabel: "Shared",
      publicSummary: "Safe client-facing summary.",
      clientNeedsAction: false,
      blockedReason: undefined,
    });
    expect(JSON.stringify(projected)).not.toContain(
      "secret implementation notes",
    );
    expect(JSON.stringify(projected)).not.toContain("private@example.com");
    expect(projected).not.toHaveProperty("rawStatus");
  });

  it("projects idea-like statuses as a safe public idea flag", () => {
    const task = parseClickUpTask({
      id: "86idea",
      name: "AI-powered client risk scoring",
      status: { status: "Idea" },
    });

    const projected = projectClickUpTask(task, {
      client: dashboardClientConfig.autopilot,
      fallbackUpdatedAt,
    });

    expect(projected?.normalizedStatus).toBe("not_started");
    expect(projected?.isIdea).toBe(true);
    expect(projected).not.toHaveProperty("rawStatus");
  });

  it("hides tasks tagged internal", () => {
    const task = parseClickUpTask({
      id: "86internal",
      name: "Internal implementation detail",
      status: { status: "in progress" },
      tags: [{ name: "internal" }],
    });

    expect(
      projectClickUpTask(task, {
        client: dashboardClientConfig.foodready,
        fallbackUpdatedAt,
      }),
    ).toBeNull();
  });

  it("hides tasks with an internal custom field", () => {
    const visibleTask = parseClickUpTask({
      id: "86visible",
      name: "Visible delivery task",
      status: { status: "queue" },
      custom_fields: [{ name: "Internal?", value: false }],
    });
    const hiddenTask = parseClickUpTask({
      id: "86hidden",
      name: "Hidden delivery task",
      status: { status: "queue" },
      custom_fields: [{ name: "Internal?", value: true }],
    });

    const projected = projectClickUpTasks([visibleTask, hiddenTask], {
      client: dashboardClientConfig.redomiciled,
      fallbackUpdatedAt,
    });

    expect(projected).toHaveLength(1);
    expect(projected[0]?.id).toBe("86visible");
  });

  it("marks waiting-on-client tasks as client action items", () => {
    const task = parseClickUpTask({
      id: "86client",
      name: "Confirm milestone language",
      status: { status: "waiting on client" },
      custom_fields: [{ name: "Public Summary", value: "Needs approval." }],
    });

    const projected = projectClickUpTask(task, {
      client: dashboardClientConfig.autopilot,
      fallbackUpdatedAt,
    });

    expect(projected?.normalizedStatus).toBe("waiting_client");
    expect(projected?.ownerLabel).toBe("Client");
    expect(projected?.clientNeedsAction).toBe(true);
  });
});

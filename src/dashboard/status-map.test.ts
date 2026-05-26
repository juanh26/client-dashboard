import { describe, expect, it } from "vitest";
import { mapClickUpStatus, normalizeStatusName } from "@/dashboard/status-map";

describe("dashboard status maps", () => {
  it("normalizes ClickUp status labels before mapping", () => {
    expect(normalizeStatusName(" In_Progress ")).toBe("in progress");
    expect(mapClickUpStatus("QUEUE", "defaultDelivery")).toBe("not_started");
  });

  it("maps known delivery statuses into stable dashboard buckets", () => {
    expect(mapClickUpStatus("pending review", "defaultDelivery")).toBe(
      "waiting_client",
    );
    expect(mapClickUpStatus("idea", "defaultDelivery")).toBe("not_started");
    expect(mapClickUpStatus("closed", "redomiciledDelivery")).toBe("done");
    expect(mapClickUpStatus("blocked", "defaultDelivery")).toBe("blocked");
  });

  it("keeps idea-like statuses visible in the queued bucket", () => {
    expect(mapClickUpStatus("Future Idea", "defaultDelivery")).toBe(
      "not_started",
    );
  });

  it("keeps unknown active statuses visible without inventing completion", () => {
    expect(mapClickUpStatus("Needs architecture pass", "defaultDelivery")).toBe(
      "in_progress",
    );
  });
});

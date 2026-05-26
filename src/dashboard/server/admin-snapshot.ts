import "server-only";

import { fetchClickUpTasksForLists, ClickUpApiError } from "@/clickup/client";
import {
  getDashboardClientConfig,
  getDashboardClientConfigs,
  type DashboardClientConfig,
} from "@/config/clients";
import { getClickUpApiToken } from "@/config/env.server";
import { getDemoDashboard } from "@/dashboard/mock-data";
import { projectClickUpTasks } from "@/dashboard/projection/clickup-task";
import type {
  AdminDashboardSnapshot,
  ClientDashboard,
  DashboardSnapshotError,
} from "@/dashboard/types";

const MOCK_SNAPSHOT_UPDATED_AT = "2026-05-18T14:00:00.000Z";
const CLICKUP_REVALIDATE_SECONDS = 300;

export async function getAdminDashboardSnapshot(): Promise<AdminDashboardSnapshot> {
  const token = getClickUpApiToken();
  const clients = getDashboardClientConfigs();

  if (!token) {
    return {
      generatedAt: MOCK_SNAPSHOT_UPDATED_AT,
      source: "mock",
      clients: clients.map(getFallbackDashboard),
      errors: [],
    };
  }

  const results = await Promise.all(
    clients.map(async (client) =>
      client.liveReadEnabled
        ? await getClientDashboardResult(client, token)
        : getMockClientDashboardResult(client),
    ),
  );
  const errors = results.flatMap((result) => result.errors);

  return {
    generatedAt: new Date().toISOString(),
    source: results.every((result) => result.source === "clickup")
      ? "clickup"
      : results.every((result) => result.source === "mock")
        ? "mock"
        : "mixed",
    clients: results.map((result) => result.dashboard),
    errors,
  };
}

export async function getClientDashboardSnapshot(
  clientSlug: string,
): Promise<ClientDashboard | undefined> {
  const client = getDashboardClientConfig(clientSlug);

  if (!client) {
    return undefined;
  }

  const token = getClickUpApiToken();

  if (!token || !client.liveReadEnabled) {
    return getFallbackDashboard(client);
  }

  try {
    return await getLiveClientDashboard(client, token);
  } catch {
    return getFallbackDashboard(client);
  }
}

async function getClientDashboardResult(
  client: DashboardClientConfig,
  token: string,
): Promise<{
  dashboard: ClientDashboard;
  errors: DashboardSnapshotError[];
  source: "clickup" | "mock";
}> {
  try {
    return {
      dashboard: await getLiveClientDashboard(client, token),
      errors: [],
      source: "clickup",
    };
  } catch (error) {
    return {
      dashboard: getFallbackDashboard(client),
      errors: [toSafeSnapshotError(client.slug, error)],
      source: "mock",
    };
  }
}

function getMockClientDashboardResult(client: DashboardClientConfig): {
  dashboard: ClientDashboard;
  errors: DashboardSnapshotError[];
  source: "mock";
} {
  return {
    dashboard: getFallbackDashboard(client),
    errors: [],
    source: "mock",
  };
}

async function getLiveClientDashboard(
  client: DashboardClientConfig,
  token: string,
): Promise<ClientDashboard> {
  const snapshotUpdatedAt = new Date().toISOString();
  const tasks = await fetchClickUpTasksForLists({
    token,
    listIds: client.clickUpListIds,
    includeClosed: true,
    subtasks: true,
    revalidateSeconds: CLICKUP_REVALIDATE_SECONDS,
  });

  return {
    clientSlug: client.slug,
    clientName: client.displayName,
    snapshotUpdatedAt,
    tasks: projectClickUpTasks(tasks, {
      client,
      fallbackUpdatedAt: snapshotUpdatedAt,
    }),
  };
}

function getFallbackDashboard(client: DashboardClientConfig): ClientDashboard {
  const dashboard = getDemoDashboard(client.slug);

  return {
    ...dashboard,
    clientName: client.displayName,
    snapshotUpdatedAt: MOCK_SNAPSHOT_UPDATED_AT,
    tasks: dashboard.tasks.map((task) => ({
      ...task,
      id: `${client.slug}-${task.id}`,
    })),
  };
}

function toSafeSnapshotError(
  clientSlug: string,
  error: unknown,
): DashboardSnapshotError {
  if (error instanceof ClickUpApiError) {
    return {
      clientSlug,
      message: error.message,
      status: error.status,
    };
  }

  return {
    clientSlug,
    message: "Unable to load live ClickUp snapshot",
  };
}

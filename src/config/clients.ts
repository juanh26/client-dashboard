import type { StatusMapId } from "@/dashboard/status-map";

export const dashboardClientSlugs = [
  "autopilot",
  "redomiciled",
  "foodready",
] as const;

export type ClientSlug = (typeof dashboardClientSlugs)[number];

export type DashboardClientConfig = {
  slug: ClientSlug;
  displayName: string;
  clickUpListIds: readonly string[];
  statusMapId: StatusMapId;
  liveReadEnabled: boolean;
};

export const dashboardClientConfig = {
  autopilot: {
    slug: "autopilot",
    displayName: "Autopilot",
    clickUpListIds: ["901324569418"],
    statusMapId: "defaultDelivery",
    liveReadEnabled: true,
  },
  redomiciled: {
    slug: "redomiciled",
    displayName: "Redomiciled",
    clickUpListIds: ["901326925792"],
    statusMapId: "redomiciledDelivery",
    liveReadEnabled: true,
  },
  foodready: {
    slug: "foodready",
    displayName: "FoodReady",
    clickUpListIds: ["901310767324"],
    statusMapId: "defaultDelivery",
    liveReadEnabled: true,
  },
} as const satisfies Record<ClientSlug, DashboardClientConfig>;

export function isDashboardClientSlug(value: string): value is ClientSlug {
  return dashboardClientSlugs.some((slug) => slug === value);
}

export function getDashboardClientConfig(
  clientSlug: string,
): DashboardClientConfig | undefined {
  if (!isDashboardClientSlug(clientSlug)) {
    return undefined;
  }

  return dashboardClientConfig[clientSlug];
}

export function getDashboardClientConfigs(): DashboardClientConfig[] {
  return dashboardClientSlugs.map((slug) => dashboardClientConfig[slug]);
}

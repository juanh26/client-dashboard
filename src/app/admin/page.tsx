import { notFound } from "next/navigation";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { getAdminDashboardsFromSnapshot } from "@/dashboard/admin-mock-data";
import { getAdminDashboardSnapshot } from "@/dashboard/server/admin-snapshot";

type AdminPageProps = {
  searchParams: Promise<{
    client?: string | string[];
  }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const snapshot = await getAdminDashboardSnapshot();
  const dashboards = getAdminDashboardsFromSnapshot(snapshot.clients, {
    errors: snapshot.errors,
    generatedAt: snapshot.generatedAt,
    source: snapshot.source,
  });
  const defaultClientSlug = dashboards[0]?.clientSlug;

  if (!defaultClientSlug) {
    notFound();
  }

  const params = await searchParams;
  const requestedClientSlug = firstParam(params.client);

  if (
    requestedClientSlug &&
    !dashboards.some(
      (dashboard) => dashboard.clientSlug === requestedClientSlug,
    )
  ) {
    notFound();
  }

  const selectedClientSlug = requestedClientSlug ?? defaultClientSlug;

  return (
    <AdminDashboard
      dashboards={dashboards}
      selectedClientSlug={selectedClientSlug}
      canSwitchClients
    />
  );
}

function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

import { notFound } from "next/navigation";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { getAdminDashboardsFromSnapshot } from "@/dashboard/admin-mock-data";
import { getClientDashboardSnapshot } from "@/dashboard/server/admin-snapshot";

export default async function ClientPage({
  params,
}: {
  params: Promise<{ clientSlug: string }>;
}) {
  const { clientSlug } = await params;
  const dashboard = await getClientDashboardSnapshot(clientSlug);

  if (!dashboard) {
    notFound();
  }

  const [clientDashboard] = getAdminDashboardsFromSnapshot([dashboard], {
    errors: [],
    generatedAt: dashboard.snapshotUpdatedAt,
    source: "mixed",
  });

  if (!clientDashboard) {
    notFound();
  }

  return (
    <AdminDashboard
      dashboards={[clientDashboard]}
      selectedClientSlug={clientDashboard.clientSlug}
      canSwitchClients={false}
    />
  );
}

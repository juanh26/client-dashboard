import { ClientDashboard } from "@/components/dashboard/client-dashboard";
import { getDemoDashboard } from "@/dashboard/mock-data";

export default async function ClientPage({
  params,
}: {
  params: Promise<{ clientSlug: string }>;
}) {
  const { clientSlug } = await params;
  const dashboard = getDemoDashboard(clientSlug);

  return <ClientDashboard dashboard={dashboard} />;
}

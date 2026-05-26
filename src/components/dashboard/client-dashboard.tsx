import Image from "next/image";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ListChecks,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDashboardSummary } from "@/dashboard/metrics";
import type {
  ClientDashboard as ClientDashboardData,
  DashboardTask,
} from "@/dashboard/types";

const statusLabels: Record<DashboardTask["normalizedStatus"], string> = {
  not_started: "Not started",
  in_progress: "In progress",
  review: "Review",
  waiting_client: "Waiting on client",
  blocked: "Blocked",
  done: "Done",
};

const statusBadgeClassName: Record<DashboardTask["normalizedStatus"], string> =
  {
    not_started: "border-white/10 bg-white/[0.04] text-[#a1a1aa]",
    in_progress: "border-[#9b84ff]/35 bg-[#8067e8]/15 text-[#dcd4ff]",
    review: "border-[#f59e0b]/35 bg-[#f59e0b]/12 text-[#f7c56a]",
    waiting_client: "border-[#facc15]/35 bg-[#facc15]/12 text-[#ffe58a]",
    blocked: "border-[#ef4444]/35 bg-[#ef4444]/12 text-[#ffaaa8]",
    done: "border-[#22c55e]/35 bg-[#22c55e]/12 text-[#95f0b2]",
  };

export function ClientDashboard({
  dashboard,
}: {
  dashboard: ClientDashboardData;
}) {
  const summary = getDashboardSummary(dashboard.tasks);
  const blockers = dashboard.tasks.filter(
    (task) => task.normalizedStatus === "blocked",
  );
  const actionItems = dashboard.tasks.filter((task) => task.clientNeedsAction);

  return (
    <main className="min-h-screen bg-[#141416] px-3 py-3 text-foreground sm:px-5 sm:py-5">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] w-full max-w-[1232px] border-x border-white/[0.06] bg-[#18181b] shadow-[0_24px_90px_rgba(0,0,0,0.22)] sm:min-h-[calc(100vh-2.5rem)]">
        <header className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] ring-1 ring-white/10">
              <Image
                src="/pulpsense-logo.svg"
                alt="PulpSense"
                width={30}
                height={20}
                className="h-5 w-auto brightness-0 invert"
                priority
              />
            </div>
            <div className="min-w-0">
              <div className="text-base font-semibold text-white">
                PulpSense
              </div>
              <div className="text-sm text-[#a1a1aa]">Delivery dashboard</div>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Badge
              variant="outline"
              className="w-fit rounded-full border-white/10 bg-white/[0.04] px-3 py-1 text-[#d5d5dc]"
            >
              <ShieldCheck className="size-3.5" />
              Client-safe snapshot
            </Badge>
            <div className="w-fit rounded-full border border-white/10 bg-[#232329] px-3 py-1.5 text-xs text-[#a1a1aa]">
              Updated {formatDateTime(dashboard.snapshotUpdatedAt)}
            </div>
          </div>
        </header>

        <div className="px-4 pb-8 sm:px-6 lg:px-8">
          <section className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-[radial-gradient(circle_at_18%_10%,rgba(155,132,255,0.26),transparent_30%),linear-gradient(180deg,#202024_0%,#2a2444_56%,#4f4387_100%)] shadow-[0_28px_80px_rgba(79,67,135,0.28)]">
            <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[1.25fr_0.75fr] lg:p-9">
              <div className="flex min-w-0 flex-col justify-between gap-8">
                <div>
                  <Badge
                    variant="outline"
                    className="mb-5 w-fit rounded-full border-white/15 bg-white/[0.08] px-3 py-1 text-[#e7e3ff]"
                  >
                    Read-only ClickUp progress
                  </Badge>
                  <h1 className="max-w-3xl text-[32px] font-semibold leading-[1.05] text-white sm:text-5xl lg:text-[54px]">
                    {dashboard.clientName} delivery progress
                  </h1>
                  <p className="mt-5 max-w-2xl text-base leading-7 text-[#d5d0e8]">
                    Active work, completed delivery, blockers, and the next
                    client decisions in one polished client-facing view.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard
                    icon={<ListChecks />}
                    label="Total tasks"
                    value={summary.total.toString()}
                    tone="primary"
                  />
                  <MetricCard
                    icon={<Clock3 />}
                    label="Active"
                    value={summary.active.toString()}
                    tone="primary"
                  />
                  <MetricCard
                    icon={<UserRoundCheck />}
                    label="Needs you"
                    value={summary.waitingOnClient.toString()}
                    tone="warning"
                  />
                  <MetricCard
                    icon={<CheckCircle2 />}
                    label="Complete"
                    value={`${summary.completionRate}%`}
                    tone="success"
                  />
                </div>
              </div>

              <Card className="rounded-[22px] border-white/10 bg-[#141416]/45 py-5 ring-1 ring-white/[0.06] backdrop-blur">
                <CardHeader className="px-5">
                  <CardDescription className="text-[#c8c2e2]">
                    Overall completion
                  </CardDescription>
                  <CardTitle className="text-6xl font-semibold leading-none text-white">
                    {summary.completionRate}%
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 px-5">
                  <Progress
                    value={summary.completionRate}
                    className="[&_[data-slot=progress-indicator]]:bg-[#9b84ff] [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:bg-white/10"
                  >
                    <ProgressLabel className="text-sm text-[#d5d0e8]">
                      {summary.done} of {summary.total} tasks complete
                    </ProgressLabel>
                    <span className="ml-auto text-sm text-[#efeaff] tabular-nums">
                      {summary.active} active
                    </span>
                  </Progress>
                  <div className="grid grid-cols-2 gap-3">
                    <HeroStat label="Blocked" value={summary.blocked} />
                    <HeroStat
                      label="Client action"
                      value={summary.waitingOnClient}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mt-6 grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
            <Card className="rounded-2xl border-white/[0.08] bg-[#1f1f24] py-5 ring-1 ring-white/[0.04]">
              <CardHeader className="gap-2 px-5 sm:flex sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-xl text-white">
                    Work in motion
                  </CardTitle>
                  <CardDescription className="mt-1 max-w-xl text-[#a1a1aa]">
                    A client-safe summary of visible delivery tasks, owners,
                    status, and timing.
                  </CardDescription>
                </div>
                <CardAction className="static col-auto row-auto mt-1 justify-self-start sm:justify-self-end">
                  <Badge
                    variant="outline"
                    className="rounded-full border-[#8067e8]/35 bg-[#8067e8]/12 text-[#dcd4ff]"
                  >
                    {summary.total} visible
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardContent className="px-0 sm:px-5">
                <TaskTable tasks={dashboard.tasks} />
              </CardContent>
            </Card>

            <div className="grid gap-5">
              <TaskListCard
                title="Needs client action"
                tasks={actionItems}
                emptyText="No client action needed."
                tone="warning"
              />
              <TaskListCard
                title="Blocked"
                tasks={blockers}
                emptyText="No blocked tasks."
                icon={<AlertTriangle className="size-4" />}
                tone="danger"
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "primary" | "success" | "warning";
}) {
  const toneClassName: Record<typeof tone, string> = {
    primary: "border-[#9b84ff]/25 bg-[#8067e8]/18 text-[#e1d9ff]",
    success: "border-[#22c55e]/25 bg-[#22c55e]/14 text-[#a7f3c3]",
    warning: "border-[#facc15]/25 bg-[#facc15]/14 text-[#ffe58a]",
  };

  return (
    <Card
      size="sm"
      className="min-h-[112px] rounded-2xl border-white/10 bg-[#141416]/38 py-4 ring-1 ring-white/[0.05] backdrop-blur transition-colors hover:bg-[#141416]/52"
    >
      <CardHeader className="px-4">
        <CardDescription className="text-xs font-medium text-[#c8c2e2]">
          {label}
        </CardDescription>
        <CardTitle className="text-3xl font-semibold text-white">
          {value}
        </CardTitle>
        <CardAction>
          <div
            className={`flex size-10 items-center justify-center rounded-full border ${toneClassName[tone]}`}
          >
            {icon}
          </div>
        </CardAction>
      </CardHeader>
    </Card>
  );
}

function HeroStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
      <div className="text-sm text-[#c8c2e2]">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function TaskTable({ tasks }: { tasks: readonly DashboardTask[] }) {
  return (
    <div className="overflow-x-auto sm:overflow-hidden sm:rounded-2xl sm:border sm:border-white/[0.08]">
      <Table className="min-w-[720px]">
        <TableHeader className="bg-[#292931]">
          <TableRow className="border-white/[0.08] hover:bg-transparent">
            <TableHead className="w-[44%] px-5 py-3 text-xs font-medium text-[#a1a1aa]">
              Task
            </TableHead>
            <TableHead className="px-5 py-3 text-xs font-medium text-[#a1a1aa]">
              Status
            </TableHead>
            <TableHead className="px-5 py-3 text-xs font-medium text-[#a1a1aa]">
              Owner
            </TableHead>
            <TableHead className="px-5 py-3 text-xs font-medium text-[#a1a1aa]">
              Due
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              className="border-white/[0.08] transition-colors hover:bg-white/[0.035]"
            >
              <TableCell className="min-w-80 whitespace-normal px-5 py-4 align-top">
                <div className="font-medium leading-6 text-white">
                  {task.title}
                </div>
                {task.publicSummary ? (
                  <div className="mt-1 max-w-xl text-sm leading-6 text-[#a1a1aa]">
                    {task.publicSummary}
                  </div>
                ) : null}
              </TableCell>
              <TableCell className="px-5 py-4 align-top">
                <StatusBadge status={task.normalizedStatus} />
              </TableCell>
              <TableCell className="whitespace-normal px-5 py-4 align-top text-[#c6c6cf]">
                {task.ownerLabel}
              </TableCell>
              <TableCell className="whitespace-normal px-5 py-4 align-top text-sm text-[#a1a1aa]">
                {formatDate(task.dueDate)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: DashboardTask["normalizedStatus"];
}) {
  return (
    <Badge
      className={`${statusBadgeClassName[status]} rounded-full px-2.5 py-1`}
      variant="outline"
    >
      {statusLabels[status]}
    </Badge>
  );
}

function TaskListCard({
  title,
  tasks,
  emptyText,
  icon,
  tone,
}: {
  title: string;
  tasks: readonly DashboardTask[];
  emptyText: string;
  icon?: ReactNode;
  tone: "warning" | "danger";
}) {
  const toneClassName: Record<typeof tone, string> = {
    warning: "border-[#facc15]/25 bg-[#facc15]/10 text-[#ffe58a]",
    danger: "border-[#ef4444]/25 bg-[#ef4444]/10 text-[#ffaaa8]",
  };

  return (
    <Card className="rounded-2xl border-white/[0.08] bg-[#1f1f24] py-5 ring-1 ring-white/[0.04]">
      <CardHeader className="px-5">
        <CardTitle className="flex items-center gap-2 text-base text-white">
          <span
            className={`flex size-8 items-center justify-center rounded-full border ${toneClassName[tone]}`}
          >
            {icon ?? <UserRoundCheck className="size-4" />}
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5">
        {tasks.length === 0 ? (
          <Empty className="rounded-2xl border border-white/[0.08] bg-[#18181b] py-8">
            <EmptyHeader>
              <EmptyTitle className="text-white">{emptyText}</EmptyTitle>
              <EmptyDescription className="text-[#a1a1aa]">
                New items will appear here when the public project status
                changes.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        <ItemGroup className="gap-3">
          {tasks.map((task) => (
            <Item
              key={task.id}
              variant="outline"
              className="items-start rounded-2xl border-white/[0.08] bg-[#18181b] p-4 hover:bg-[#232329]"
            >
              <ItemContent>
                <ItemTitle className="line-clamp-none w-full text-white">
                  {task.title}
                </ItemTitle>
                <ItemDescription className="line-clamp-none leading-6 text-[#a1a1aa]">
                  {task.blockedReason ??
                    task.publicSummary ??
                    statusLabels[task.normalizedStatus]}
                </ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(value?: string) {
  if (!value) {
    return "No date";
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

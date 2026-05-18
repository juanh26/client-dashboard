import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ListChecks,
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
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
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
    not_started: "border-border bg-muted text-muted-foreground",
    in_progress: "border-primary/25 bg-primary/15 text-foreground",
    review: "border-accent/40 bg-accent/20 text-foreground",
    waiting_client: "border-primary/30 bg-primary/20 text-foreground",
    blocked: "border-destructive/25 bg-destructive/10 text-destructive",
    done: "border-primary/35 bg-primary/25 text-foreground",
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
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b bg-card">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-8 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-3 w-fit">
                PulpSense delivery dashboard
              </Badge>
              <h1 className="text-3xl font-semibold tracking-normal md:text-5xl">
                {dashboard.clientName} progress
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                A client-safe snapshot of active work, blocked items, recent
                progress, and where the next client action is needed.
              </p>
            </div>
            <div className="rounded-md border bg-background px-4 py-3 text-sm text-muted-foreground">
              Updated{" "}
              {new Date(dashboard.snapshotUpdatedAt).toLocaleString("en-US")}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-6 md:grid-cols-4 md:px-8">
        <MetricCard
          icon={<ListChecks />}
          label="Total tasks"
          value={summary.total.toString()}
        />
        <MetricCard
          icon={<Clock3 />}
          label="Active"
          value={summary.active.toString()}
        />
        <MetricCard
          icon={<UserRoundCheck />}
          label="Needs you"
          value={summary.waitingOnClient.toString()}
        />
        <MetricCard
          icon={<CheckCircle2 />}
          label="Complete"
          value={`${summary.completionRate}%`}
        />
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 pb-8 md:grid-cols-[1.4fr_0.9fr] md:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Progress overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Progress value={summary.completionRate}>
              <ProgressLabel>Completion</ProgressLabel>
              <ProgressValue>{() => `${summary.done} done`}</ProgressValue>
            </Progress>
            <TaskTable tasks={dashboard.tasks} />
          </CardContent>
        </Card>

        <div className="space-y-5">
          <TaskListCard
            title="Needs client action"
            tasks={actionItems}
            emptyText="No client action needed."
          />
          <TaskListCard
            title="Blocked"
            tasks={blockers}
            emptyText="No blocked tasks."
            icon={<AlertTriangle className="size-4" />}
          />
        </div>
      </section>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card size="sm" className="min-h-28">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl font-semibold">{value}</CardTitle>
        <CardAction>
          <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            {icon}
          </div>
        </CardAction>
      </CardHeader>
    </Card>
  );
}

function TaskTable({ tasks }: { tasks: readonly DashboardTask[] }) {
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Due</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="min-w-72 whitespace-normal">
                <div className="font-medium">{task.title}</div>
                {task.publicSummary ? (
                  <div className="mt-1 max-w-xl text-sm text-muted-foreground">
                    {task.publicSummary}
                  </div>
                ) : null}
              </TableCell>
              <TableCell>
                <StatusBadge status={task.normalizedStatus} />
              </TableCell>
              <TableCell className="whitespace-normal">
                {task.ownerLabel}
              </TableCell>
              <TableCell className="whitespace-normal">
                {task.dueDate ?? "No date"}
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
    <Badge className={statusBadgeClassName[status]} variant="outline">
      {statusLabels[status]}
    </Badge>
  );
}

function TaskListCard({
  title,
  tasks,
  emptyText,
  icon,
}: {
  title: string;
  tasks: readonly DashboardTask[];
  emptyText: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>{emptyText}</EmptyTitle>
              <EmptyDescription>
                New items will appear here when ClickUp status changes.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        <ItemGroup className="gap-3">
          {tasks.map((task) => (
            <Item key={task.id} variant="outline">
              <ItemContent>
                <ItemTitle className="line-clamp-none">{task.title}</ItemTitle>
                <ItemDescription className="line-clamp-none">
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

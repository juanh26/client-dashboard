import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ListChecks,
  UserRoundCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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

const statusTone: Record<DashboardTask["normalizedStatus"], string> = {
  not_started: "bg-muted text-muted-foreground",
  in_progress: "bg-sky-100 text-sky-900",
  review: "bg-amber-100 text-amber-950",
  waiting_client: "bg-lime-100 text-lime-950",
  blocked: "bg-red-100 text-red-950",
  done: "bg-emerald-100 text-emerald-950",
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
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completion</span>
                <span className="font-medium">{summary.done} done</span>
              </div>
              <Progress value={summary.completionRate} />
            </div>
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
    <Card>
      <CardContent className="flex min-h-28 items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
          {icon}
        </div>
      </CardContent>
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
              <TableCell>
                <div className="font-medium">{task.title}</div>
                {task.publicSummary ? (
                  <div className="mt-1 max-w-xl text-sm text-muted-foreground">
                    {task.publicSummary}
                  </div>
                ) : null}
              </TableCell>
              <TableCell>
                <Badge
                  className={statusTone[task.normalizedStatus]}
                  variant="secondary"
                >
                  {statusLabels[task.normalizedStatus]}
                </Badge>
              </TableCell>
              <TableCell>{task.ownerLabel}</TableCell>
              <TableCell>{task.dueDate ?? "No date"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
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
      <CardContent className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        ) : null}
        {tasks.map((task) => (
          <div key={task.id} className="rounded-md border p-3">
            <div className="text-sm font-medium">{task.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {task.blockedReason ??
                task.publicSummary ??
                statusLabels[task.normalizedStatus]}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

"use client";

import type { ReactNode } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flag,
  Lightbulb,
  ShieldAlert,
  UserRoundCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DashboardTask } from "@/dashboard/types";
import { cn } from "@/lib/utils";

export type TaskDetailModalProps = {
  task: DashboardTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  dashboardUpdatedAt?: string;
};

const statusLabels = {
  not_started: "Not started",
  in_progress: "In progress",
  review: "Review",
  waiting_client: "Waiting on client",
  blocked: "Blocked",
  done: "Done",
} satisfies Record<DashboardTask["normalizedStatus"], string>;

const statusStyles = {
  not_started: "border-white/10 bg-white/[0.04] text-[#aab1c6]",
  in_progress: "border-[#9b84ff]/35 bg-[#8067e8]/18 text-[#dfd7ff]",
  review: "border-[#f59e0b]/35 bg-[#f59e0b]/13 text-[#ffd98a]",
  waiting_client: "border-[#facc15]/35 bg-[#facc15]/12 text-[#ffe58a]",
  blocked: "border-[#ef4444]/35 bg-[#ef4444]/14 text-[#ffaaa8]",
  done: "border-[#22c55e]/30 bg-[#22c55e]/13 text-[#9ef0b8]",
} satisfies Record<DashboardTask["normalizedStatus"], string>;

const priorityLabels = {
  urgent: "Urgent",
  high: "High",
  normal: "Medium",
  low: "Low",
} satisfies Record<NonNullable<DashboardTask["priority"]>, string>;

const priorityStyles = {
  urgent: "border-[#ef4444]/35 bg-[#ef4444]/14 text-[#ffaaa8]",
  high: "border-[#9b84ff]/35 bg-[#8067e8]/18 text-[#dcd4ff]",
  normal: "border-[#f59e0b]/35 bg-[#f59e0b]/13 text-[#ffd98a]",
  low: "border-[#5b7cff]/35 bg-[#5b7cff]/14 text-[#bfcaff]",
} satisfies Record<NonNullable<DashboardTask["priority"]>, string>;

const ownerStyles = {
  PulpSense: "border-[#9b84ff]/32 bg-[#8067e8]/20 text-[#efeaff]",
  Client: "border-[#f59e0b]/32 bg-[#f59e0b]/14 text-[#ffe1a3]",
  Shared: "border-[#5b7cff]/32 bg-[#5b7cff]/14 text-[#cfd7ff]",
} satisfies Record<DashboardTask["ownerLabel"], string>;

export function TaskDetailModal({
  task,
  open,
  onOpenChange,
  clientName,
  dashboardUpdatedAt,
}: TaskDetailModalProps) {
  const title = task?.title.trim() || "Task details";
  const isPastDueDate = task ? isPastDue(task, dashboardUpdatedAt) : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-hidden rounded-[18px] border-white/[0.08] bg-[radial-gradient(circle_at_18%_0%,rgba(128,103,232,0.16),transparent_30%),linear-gradient(180deg,#071026_0%,#080e20_50%,#050914_100%)] p-0 text-[#f7f7f8] shadow-[0_24px_90px_rgba(0,0,0,0.42)] ring-1 ring-white/[0.04] sm:max-w-2xl">
        <div className="max-h-[calc(100vh-2rem)] overflow-y-auto">
          <DialogHeader className="gap-3 border-b border-white/[0.08] px-4 py-4 pr-12 sm:px-5 sm:py-5">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {task ? <StatusBadge status={task.normalizedStatus} /> : null}
              {task?.isIdea ? (
                <Badge
                  variant="outline"
                  className="rounded-full border-white/12 bg-white/[0.045] px-2.5 py-1 text-[#d6dbe8]"
                >
                  <Lightbulb className="size-3.5" />
                  Idea
                </Badge>
              ) : null}
            </div>
            <div className="min-w-0">
              <DialogTitle className="line-clamp-3 text-xl font-semibold leading-7 text-white sm:text-2xl">
                {title}
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-[#aab1c6]">
                {clientName} task detail
              </DialogDescription>
            </div>
          </DialogHeader>

          {task ? (
            <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-5">
              <section className="grid gap-2 sm:grid-cols-2">
                <DetailTile
                  icon={<UserRoundCheck className="size-4" />}
                  label="Owner"
                  value={task.ownerLabel}
                  valueClassName={ownerStyles[task.ownerLabel]}
                />
                <DetailTile
                  icon={<CalendarDays className="size-4" />}
                  label="Due date"
                  value={formatDate(task.dueDate)}
                  valueClassName={
                    isPastDueDate
                      ? "border-[#ef4444]/35 bg-[#ef4444]/14 text-[#ffaaa8]"
                      : "border-white/10 bg-white/[0.04] text-[#c7cce0]"
                  }
                />
                <DetailTile
                  icon={<Flag className="size-4" />}
                  label="Priority"
                  value={
                    task.priority ? priorityLabels[task.priority] : "Not set"
                  }
                  valueClassName={
                    task.priority
                      ? priorityStyles[task.priority]
                      : "border-white/10 bg-white/[0.04] text-[#8f96ad]"
                  }
                />
                <DetailTile
                  icon={<Clock3 className="size-4" />}
                  label="Status"
                  value={statusLabels[task.normalizedStatus]}
                  valueClassName={statusStyles[task.normalizedStatus]}
                />
              </section>

              <TextSection
                title="Public summary"
                body={task.publicSummary}
                empty="No public summary provided."
              />

              <ActionSection task={task} />

              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                <h3 className="text-sm font-semibold text-white">
                  Timestamps
                </h3>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Timestamp label="Updated" value={task.updatedAt} />
                  <Timestamp label="Completed" value={task.doneAt} />
                  {dashboardUpdatedAt ? (
                    <Timestamp
                      label="Dashboard snapshot"
                      value={dashboardUpdatedAt}
                    />
                  ) : null}
                </dl>
              </section>
            </div>
          ) : (
            <div className="px-4 py-10 sm:px-5">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 text-center">
                <div className="mx-auto flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#aab1c6]">
                  <Clock3 className="size-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-white">
                  No task selected
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#8f96ad]">
                  Select a visible task to inspect its client-safe details.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatusBadge({
  status,
}: {
  status: DashboardTask["normalizedStatus"];
}) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-2.5 py-1", statusStyles[status])}
    >
      {status === "done" ? <CheckCircle2 className="size-3.5" /> : null}
      {statusLabels[status]}
    </Badge>
  );
}

function DetailTile({
  icon,
  label,
  value,
  valueClassName,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  valueClassName: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3.5">
      <div className="flex items-center gap-2 text-xs font-medium text-[#8f96ad]">
        {icon}
        {label}
      </div>
      <div
        className={cn(
          "mt-3 inline-flex max-w-full rounded-full border px-2.5 py-1 text-xs font-medium",
          valueClassName,
        )}
      >
        <span className="truncate">{value}</span>
      </div>
    </div>
  );
}

function TextSection({
  title,
  body,
  empty,
}: {
  title: string;
  body?: string;
  empty: string;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p
        className={cn(
          "mt-2 text-sm leading-6",
          body ? "text-[#c7cce0]" : "text-[#6f778d]",
        )}
      >
        {body || empty}
      </p>
    </section>
  );
}

function ActionSection({ task }: { task: DashboardTask }) {
  const hasBlockedReason = Boolean(task.blockedReason);
  const hasClientAction = task.clientNeedsAction;

  if (!hasBlockedReason && !hasClientAction) {
    return (
      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
        <h3 className="text-sm font-semibold text-white">Blocker</h3>
        <p className="mt-2 text-sm leading-6 text-[#6f778d]">
          No blocker or client action flagged.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[#ef4444]/20 bg-[#2c1219]/42 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        {hasBlockedReason ? (
          <ShieldAlert className="size-4 text-[#ffaaa8]" />
        ) : (
          <AlertTriangle className="size-4 text-[#ffe58a]" />
        )}
        {hasBlockedReason ? "Blocked" : "Client action needed"}
      </div>
      {task.blockedReason ? (
        <p className="mt-2 text-sm leading-6 text-[#ffcfce]">
          {task.blockedReason}
        </p>
      ) : null}
      {hasClientAction ? (
        <Badge
          variant="outline"
          className="mt-3 rounded-full border-[#f59e0b]/30 bg-[#f59e0b]/14 px-2.5 py-1 text-[#ffe1a3]"
        >
          <UserRoundCheck className="size-3.5" />
          Client action
        </Badge>
      ) : null}
    </section>
  );
}

function Timestamp({ label, value }: { label: string; value?: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
      <dt className="text-xs text-[#8f96ad]">{label}</dt>
      <dd
        className={cn(
          "mt-1 truncate text-sm tabular-nums",
          value ? "text-[#c7cce0]" : "text-[#6f778d]",
        )}
      >
        {value ? formatDateTime(value) : "Not available"}
      </dd>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) {
    return "No due date";
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
  });
}

function isPastDue(task: DashboardTask, dashboardUpdatedAt?: string) {
  if (!task.dueDate || task.normalizedStatus === "done") {
    return false;
  }

  const dueDate = new Date(`${task.dueDate}T23:59:59`).getTime();
  const referenceDate = new Date(dashboardUpdatedAt ?? Date.now()).getTime();

  return Number.isFinite(dueDate) && dueDate < referenceDate;
}

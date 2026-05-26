"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  Flag,
  Hourglass,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  LucideIcon,
  MoreVertical,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  UsersRound,
  UserRoundCheck,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskDetailModal } from "@/components/dashboard/task-detail-modal";
import type {
  AdminActivity,
  AdminClientDashboard,
  AdminMeeting,
} from "@/dashboard/admin-mock-data";
import { getDashboardSummary } from "@/dashboard/metrics";
import type { DashboardTask } from "@/dashboard/types";
import { cn } from "@/lib/utils";

type AdminDashboardProps = {
  dashboards: readonly AdminClientDashboard[];
  selectedClientSlug: string;
  canSwitchClients?: boolean;
};

type TaskGroupId = "working" | "queued" | "ideas" | "finished" | "blocked";
type GroupTone = "primary" | "warning" | "idea" | "success" | "danger";
type TaskFilterValue = "all" | TaskGroupId;
type TaskSortValue =
  | "default"
  | "due_asc"
  | "due_desc"
  | "updated_desc"
  | "priority_desc"
  | "title_asc";

type TaskGroup = {
  id: TaskGroupId;
  title: string;
  icon: LucideIcon;
  tone: GroupTone;
};

const navItems = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Tasks", icon: ListChecks },
  { label: "Calendar", icon: CalendarDays },
  { label: "Meetings", icon: UsersRound },
  { label: "Reports", icon: FileText },
  { label: "Clients", icon: UserRoundCheck },
  { label: "Settings", icon: Settings },
] satisfies {
  label: string;
  icon: LucideIcon;
  active?: boolean;
}[];

const taskGroups = [
  {
    id: "blocked",
    title: "Blocked",
    icon: ShieldAlert,
    tone: "danger",
  },
  {
    id: "working",
    title: "Working on",
    icon: Sparkles,
    tone: "primary",
  },
  {
    id: "queued",
    title: "Queued",
    icon: Hourglass,
    tone: "warning",
  },
  {
    id: "ideas",
    title: "Ideas",
    icon: Lightbulb,
    tone: "idea",
  },
  {
    id: "finished",
    title: "Finished",
    icon: CheckCircle2,
    tone: "success",
  },
] satisfies readonly TaskGroup[];

const taskFilterOptions = [
  { value: "all", label: "All groups" },
  { value: "blocked", label: "Blocked" },
  { value: "working", label: "Working on" },
  { value: "queued", label: "Queued" },
  { value: "ideas", label: "Ideas" },
  { value: "finished", label: "Finished" },
] satisfies readonly { value: TaskFilterValue; label: string }[];

const taskSortOptions = [
  { value: "default", label: "Default order" },
  { value: "due_asc", label: "Due date ↑" },
  { value: "due_desc", label: "Due date ↓" },
  { value: "updated_desc", label: "Recently updated" },
  { value: "priority_desc", label: "Priority" },
  { value: "title_asc", label: "Task A-Z" },
] satisfies readonly { value: TaskSortValue; label: string }[];

const groupToneStyles = {
  primary: {
    accent: "bg-[#9b84ff]",
    count: "border-[#9b84ff]/24 bg-[#8067e8]/16 text-[#dfd7ff]",
    icon: "border-[#9b84ff]/28 bg-[#8067e8]/20 text-[#d9d0ff]",
    panel:
      "border-[#8067e8]/22 bg-[linear-gradient(180deg,rgba(17,26,58,0.92),rgba(9,15,34,0.9))]",
    row: "hover:bg-[#8067e8]/8",
  },
  warning: {
    accent: "bg-[#f59e0b]",
    count: "border-[#f59e0b]/28 bg-[#f59e0b]/12 text-[#ffd98a]",
    icon: "border-[#f59e0b]/30 bg-[#f59e0b]/14 text-[#ffd98a]",
    panel:
      "border-[#f59e0b]/20 bg-[linear-gradient(180deg,rgba(34,29,15,0.88),rgba(10,16,31,0.9))]",
    row: "hover:bg-[#f59e0b]/7",
  },
  idea: {
    accent: "bg-[#94a3b8]",
    count: "border-white/12 bg-white/[0.045] text-[#d6dbe8]",
    icon: "border-white/12 bg-white/[0.05] text-[#d6dbe8]",
    panel:
      "border-white/[0.09] bg-[linear-gradient(180deg,rgba(18,25,42,0.88),rgba(8,14,29,0.92))]",
    row: "hover:bg-white/[0.035]",
  },
  success: {
    accent: "bg-[#22c55e]",
    count: "border-[#22c55e]/28 bg-[#22c55e]/13 text-[#a7f3c3]",
    icon: "border-[#22c55e]/30 bg-[#22c55e]/15 text-[#8ef0ad]",
    panel:
      "border-[#22c55e]/20 bg-[linear-gradient(180deg,rgba(12,39,32,0.82),rgba(8,17,28,0.92))]",
    row: "hover:bg-[#22c55e]/7",
  },
  danger: {
    accent: "bg-[#ef4444]",
    count: "border-[#ef4444]/30 bg-[#ef4444]/14 text-[#ffaaa8]",
    icon: "border-[#ef4444]/30 bg-[#ef4444]/14 text-[#ffaaa8]",
    panel:
      "border-[#ef4444]/22 bg-[linear-gradient(180deg,rgba(44,18,25,0.86),rgba(10,15,30,0.92))]",
    row: "hover:bg-[#ef4444]/7",
  },
} satisfies Record<
  GroupTone,
  {
    accent: string;
    count: string;
    icon: string;
    panel: string;
    row: string;
  }
>;

const priorityStyles = {
  urgent: "border-[#ef4444]/35 bg-[#ef4444]/14 text-[#ffaaa8]",
  high: "border-[#9b84ff]/35 bg-[#8067e8]/18 text-[#dcd4ff]",
  normal: "border-[#f59e0b]/35 bg-[#f59e0b]/13 text-[#ffd98a]",
  low: "border-[#5b7cff]/35 bg-[#5b7cff]/14 text-[#bfcaff]",
  done: "border-[#22c55e]/30 bg-[#22c55e]/13 text-[#9ef0b8]",
} satisfies Record<NonNullable<DashboardTask["priority"]> | "done", string>;

const priorityRank = {
  urgent: 4,
  high: 3,
  normal: 2,
  low: 1,
} satisfies Record<NonNullable<DashboardTask["priority"]>, number>;

const ownerStyles = {
  PulpSense: {
    initials: "PS",
    className: "border-[#9b84ff]/32 bg-[#8067e8]/20 text-[#efeaff]",
  },
  Client: {
    initials: "CL",
    className: "border-[#f59e0b]/32 bg-[#f59e0b]/14 text-[#ffe1a3]",
  },
  Shared: {
    initials: "SH",
    className: "border-[#5b7cff]/32 bg-[#5b7cff]/14 text-[#cfd7ff]",
  },
} satisfies Record<
  DashboardTask["ownerLabel"],
  {
    initials: string;
    className: string;
  }
>;

const activityStyles: Record<
  AdminActivity["kind"],
  { icon: LucideIcon; className: string }
> = {
  completed: {
    icon: CheckCircle2,
    className: "border-[#22c55e]/25 bg-[#22c55e]/14 text-[#86efac]",
  },
  moved: {
    icon: FileText,
    className: "border-[#8067e8]/25 bg-[#8067e8]/16 text-[#cfc4ff]",
  },
  blocked: {
    icon: ShieldAlert,
    className: "border-[#ef4444]/25 bg-[#ef4444]/14 text-[#ffaaa8]",
  },
  client: {
    icon: UsersRound,
    className: "border-[#f59e0b]/25 bg-[#f59e0b]/14 text-[#ffe58a]",
  },
};

export function AdminDashboard({
  dashboards,
  selectedClientSlug,
  canSwitchClients = true,
}: AdminDashboardProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const selectedDashboard =
    dashboards.find(
      (dashboard) => dashboard.clientSlug === selectedClientSlug,
    ) ?? dashboards[0];

  if (!selectedDashboard) {
    return null;
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#050914] text-[#f7f7f8]">
      <AdminGlobalHeader dashboard={selectedDashboard} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:flex-row">
        <AdminSidebar
          dashboards={dashboards}
          selectedClientSlug={selectedDashboard.clientSlug}
          canSwitchClients={canSwitchClients}
          expanded={sidebarExpanded}
          onExpandedChange={setSidebarExpanded}
        />

        <section className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto p-3 sm:p-4 lg:overflow-hidden">
          <div className="mx-auto grid min-h-full max-w-[1660px] gap-4 xl:h-full xl:min-h-0 xl:grid-cols-[minmax(0,1fr)_350px]">
            <GroupedTaskList dashboard={selectedDashboard} />
            <DashboardRightRail
              activity={selectedDashboard.activity}
              meetings={selectedDashboard.meetings}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function AdminSidebar({
  dashboards,
  selectedClientSlug,
  canSwitchClients,
  expanded,
  onExpandedChange,
}: {
  dashboards: readonly AdminClientDashboard[];
  selectedClientSlug: string;
  canSwitchClients: boolean;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}) {
  return (
    <aside
      className={cn(
        "w-full shrink-0 border-b border-white/[0.08] bg-[#060b18]/96 px-3 py-2.5 transition-[width] duration-200 lg:flex lg:h-full lg:flex-col lg:border-b-0 lg:border-r lg:px-3 lg:py-4",
        expanded ? "lg:w-[260px] xl:w-[280px]" : "lg:w-[88px]",
      )}
    >
      <div
        className={cn(
          "mb-3 hidden items-center lg:flex",
          expanded ? "justify-between" : "justify-center",
        )}
      >
        {expanded ? (
          <div className="min-w-0 px-1 text-xs font-medium uppercase tracking-wide text-[#8f96ad]">
            Admin
          </div>
        ) : null}
        <button
          type="button"
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={expanded}
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          onClick={() => onExpandedChange(!expanded)}
          className="flex size-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-[#c7cce0] transition-colors hover:bg-white/[0.07] hover:text-white"
        >
          <ChevronRight
            className={cn(
              "size-4 transition-transform",
              expanded && "rotate-180",
            )}
          />
        </button>
      </div>

      <nav className="grid grid-cols-8 gap-1.5 lg:flex lg:flex-col lg:gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className={cn(
                "flex h-9 min-w-0 items-center justify-center gap-2 rounded-xl px-2 text-xs text-[#aab1c6] transition-colors sm:h-10 sm:text-sm lg:h-11",
                expanded ? "lg:justify-start lg:px-3" : "lg:justify-center",
                item.active
                  ? "border border-[#8067e8]/24 bg-[#8067e8]/18 text-white shadow-[0_10px_30px_rgba(128,103,232,0.16)]"
                  : "hover:bg-white/[0.05] hover:text-white",
              )}
              title={item.label}
            >
              <Icon className="size-4 shrink-0" />
              <span className={cn("hidden truncate", expanded && "lg:block")}>
                {item.label}
              </span>
            </div>
          );
        })}
      </nav>

      {canSwitchClients ? (
        <div className="mt-2 min-h-0 lg:mt-5 lg:flex lg:flex-1 lg:flex-col">
          <div
            className={cn(
              "mb-2 flex items-center justify-between px-1 text-xs font-medium text-[#8f96ad]",
              !expanded && "lg:justify-center",
            )}
          >
            <span className={cn("lg:hidden", expanded && "lg:inline")}>
              Clients
            </span>
            <Badge
              variant="outline"
              className="rounded-full border-white/10 bg-white/[0.04] px-2 text-[#c7cce0] lg:mx-auto 2xl:mx-0"
            >
              {dashboards.length}
            </Badge>
          </div>
          <div className="flex max-w-full gap-2 overflow-x-auto pb-1 lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:pb-0 lg:pr-1">
            {dashboards.map((dashboard) => (
              <ClientSelectorItem
                key={dashboard.clientSlug}
                dashboard={dashboard}
                selected={dashboard.clientSlug === selectedClientSlug}
                expanded={expanded}
              />
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}

function ClientSelectorItem({
  dashboard,
  selected,
  expanded,
}: {
  dashboard: AdminClientDashboard;
  selected: boolean;
  expanded: boolean;
}) {
  const counts = getAdminCounts(dashboard.tasks);
  const initials = getClientInitials(dashboard.clientName);

  return (
    <Link
      href={`/admin?client=${dashboard.clientSlug}`}
      aria-current={selected ? "page" : undefined}
      aria-label={`${dashboard.clientName}, ${counts.total} tasks`}
      title={`${dashboard.clientName} (${counts.total} tasks)`}
      className={cn(
        "w-[158px] shrink-0 rounded-2xl border px-3 py-2.5 transition-colors lg:w-full",
        expanded
          ? "lg:px-3 lg:py-3"
          : "lg:flex lg:h-12 lg:items-center lg:justify-center lg:px-1.5 lg:py-1.5",
        selected
          ? "border-[#8067e8]/38 bg-[#8067e8]/16 text-white"
          : "border-white/[0.08] bg-white/[0.035] text-[#c7cce0] hover:bg-white/[0.06] hover:text-white",
      )}
    >
      <div
        className={cn(
          "flex items-start justify-between gap-3",
          !expanded && "lg:items-center lg:justify-center",
        )}
      >
        <div className={cn("min-w-0", !expanded && "lg:hidden")}>
          <div className="truncate text-sm font-medium">
            {dashboard.clientName}
          </div>
        </div>
        <div
          className={cn(
            "rounded-full border px-2 py-0.5 text-xs tabular-nums",
            !expanded &&
              "lg:flex lg:size-8 lg:items-center lg:justify-center lg:px-0 lg:py-0",
            selected
              ? "border-[#9b84ff]/30 bg-[#8067e8]/20 text-[#efeaff]"
              : "border-white/10 bg-white/[0.04] text-[#b9bfd4]",
          )}
        >
          <span className={cn(!expanded && "lg:hidden")}>{counts.total}</span>
          <span
            className={cn(
              "hidden text-[11px] font-semibold tracking-wide",
              !expanded && "lg:inline",
            )}
          >
            {initials}
          </span>
        </div>
      </div>
      <div
        className={cn(
          "mt-2 hidden grid-cols-2 gap-2 text-xs text-[#8f96ad]",
          expanded && "lg:grid",
        )}
      >
        <span className="truncate">{counts.total} tasks</span>
        <span className="truncate">{counts.blocked} blocked</span>
      </div>
    </Link>
  );
}

function AdminGlobalHeader({ dashboard }: { dashboard: AdminClientDashboard }) {
  return (
    <header className="z-30 shrink-0 border-b border-white/[0.08] bg-[#050914]/96 backdrop-blur">
      <div className="flex min-h-20 items-center gap-4 px-3 py-3 sm:px-4 lg:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#1d1a4a] ring-1 ring-[#8067e8]/30">
            <Image
              src="/pulpsense-logo.svg"
              alt="PulpSense"
              width={31}
              height={22}
              className="h-5 w-auto brightness-0 invert"
              priority
            />
          </div>
          <div className="min-w-0">
            <div className="truncate text-lg font-semibold text-white sm:text-xl">
              PulpSense
            </div>
            <div className="truncate text-xs text-[#aab1c6] sm:text-sm">
              Delivery dashboard
            </div>
          </div>
        </div>

        <div className="hidden h-10 w-px shrink-0 bg-white/[0.08] md:block" />

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-semibold leading-tight text-white sm:text-3xl">
            {dashboard.clientName}
          </h1>
          <p className="mt-1 line-clamp-1 max-w-3xl text-sm text-[#aab1c6]">
            Track active work, finished delivery, blockers, upcoming meetings,
            and public-safe client action items.
          </p>
        </div>
      </div>
    </header>
  );
}

function GroupedTaskList({ dashboard }: { dashboard: AdminClientDashboard }) {
  const [collapsedGroups, setCollapsedGroups] = useState<
    Partial<Record<TaskGroupId, boolean>>
  >({});
  const [filterValue, setFilterValue] = useState<TaskFilterValue>("all");
  const [sortValue, setSortValue] = useState<TaskSortValue>("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<DashboardTask | null>(null);
  const filteredTasks = useMemo(
    () =>
      sortTasks(
        dashboard.tasks.filter((task) =>
          shouldShowTask(task, filterValue, searchQuery),
        ),
        sortValue,
      ),
    [dashboard.tasks, filterValue, searchQuery, sortValue],
  );
  const groupedTasks = taskGroups
    .filter((group) => filterValue === "all" || group.id === filterValue)
    .map((group) => ({
      group,
      tasks: filteredTasks.filter((task) => getTaskGroupId(task) === group.id),
    }));
  const activeFilterCount =
    (filterValue === "all" ? 0 : 1) +
    (sortValue === "default" ? 0 : 1) +
    (searchQuery.trim() ? 1 : 0);

  function toggleGroup(groupId: TaskGroupId) {
    setCollapsedGroups((current) => ({
      ...current,
      [groupId]: !current[groupId],
    }));
  }

  return (
    <section className="flex min-w-0 flex-col overflow-visible rounded-[18px] border border-white/[0.08] bg-[radial-gradient(circle_at_20%_0%,rgba(128,103,232,0.15),transparent_30%),linear-gradient(180deg,#071026_0%,#080e20_48%,#050914_100%)] shadow-[0_22px_80px_rgba(0,0,0,0.32)] xl:min-h-0 xl:overflow-hidden">
      <TaskListControls
        activeFilterCount={activeFilterCount}
        filterValue={filterValue}
        resultCount={filteredTasks.length}
        searchQuery={searchQuery}
        sortValue={sortValue}
        totalCount={dashboard.tasks.length}
        onFilterChange={setFilterValue}
        onSearchChange={setSearchQuery}
        onSortChange={setSortValue}
      />
      <div className="min-h-0 flex-1 p-2.5 pt-0 sm:p-3 sm:pt-0 xl:overflow-y-auto">
        <div className="flex flex-col gap-2.5">
          {groupedTasks.map(({ group, tasks }) => (
            <TaskGroupPanel
              key={group.id}
              dashboardUpdatedAt={dashboard.snapshotUpdatedAt}
              group={group}
              collapsed={Boolean(collapsedGroups[group.id])}
              tasks={tasks}
              onToggle={() => toggleGroup(group.id)}
              onTaskSelect={setSelectedTask}
            />
          ))}
        </div>
      </div>
      <TaskDetailModal
        clientName={dashboard.clientName}
        dashboardUpdatedAt={dashboard.snapshotUpdatedAt}
        open={Boolean(selectedTask)}
        task={selectedTask}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTask(null);
          }
        }}
      />
    </section>
  );
}

function TaskListControls({
  activeFilterCount,
  filterValue,
  resultCount,
  searchQuery,
  sortValue,
  totalCount,
  onFilterChange,
  onSearchChange,
  onSortChange,
}: {
  activeFilterCount: number;
  filterValue: TaskFilterValue;
  resultCount: number;
  searchQuery: string;
  sortValue: TaskSortValue;
  totalCount: number;
  onFilterChange: (value: TaskFilterValue) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: TaskSortValue) => void;
}) {
  return (
    <div className="grid gap-2.5 border-b border-white/[0.07] p-2.5 sm:p-3 lg:grid-cols-[minmax(220px,1fr)_auto] lg:items-center">
      <div className="flex min-w-0 items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8f96ad]" />
          <Input
            aria-label="Search tasks"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.currentTarget.value)}
            placeholder="Search tasks"
            className="h-9 rounded-xl border-white/[0.09] bg-white/[0.035] pl-9 text-sm text-[#f4f6ff] placeholder:text-[#737b91] focus-visible:border-[#8067e8]/55 focus-visible:ring-[#8067e8]/25"
          />
        </div>
        <span className="hidden shrink-0 rounded-full border border-white/[0.08] bg-white/[0.035] px-2.5 py-1 text-xs text-[#aab1c6] sm:inline-flex">
          {resultCount}/{totalCount}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-0 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.035] px-2 py-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#aab1c6]">
            <ListChecks className="size-3.5" />
            Filter
          </span>
          <Select
            value={filterValue}
            onValueChange={(value) =>
              onFilterChange(value as TaskFilterValue)
            }
          >
            <SelectTrigger
              aria-label="Filter task group"
              size="sm"
              className="h-7 min-w-[8.25rem] rounded-lg border-white/[0.08] bg-[#0f1730]/80 px-2 text-[#f4f6ff] hover:bg-[#151e3a] focus-visible:border-[#8067e8]/55 focus-visible:ring-[#8067e8]/25"
            >
              <SelectValue>{getTaskFilterLabel(filterValue)}</SelectValue>
            </SelectTrigger>
            <SelectContent
              align="start"
              className="border border-white/[0.09] bg-[#0b1227] p-1 text-[#f4f6ff] shadow-[0_18px_60px_rgba(0,0,0,0.42)] ring-1 ring-white/[0.04]"
            >
              {taskFilterOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="rounded-md text-[#d7dced] focus:bg-[#8067e8]/18 focus:text-white"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex min-w-0 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.035] px-2 py-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#aab1c6]">
            <ArrowUpDown className="size-3.5" />
            Sort
          </span>
          <Select
            value={sortValue}
            onValueChange={(value) =>
              onSortChange(value as TaskSortValue)
            }
          >
            <SelectTrigger
              aria-label="Sort tasks"
              size="sm"
              className="h-7 min-w-[9.25rem] rounded-lg border-white/[0.08] bg-[#0f1730]/80 px-2 text-[#f4f6ff] hover:bg-[#151e3a] focus-visible:border-[#8067e8]/55 focus-visible:ring-[#8067e8]/25"
            >
              <SelectValue>{getTaskSortLabel(sortValue)}</SelectValue>
            </SelectTrigger>
            <SelectContent
              align="start"
              className="border border-white/[0.09] bg-[#0b1227] p-1 text-[#f4f6ff] shadow-[0_18px_60px_rgba(0,0,0,0.42)] ring-1 ring-white/[0.04]"
            >
              {taskSortOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="rounded-md text-[#d7dced] focus:bg-[#8067e8]/18 focus:text-white"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {activeFilterCount > 0 ? (
          <button
            type="button"
            onClick={() => {
              onFilterChange("all");
              onSearchChange("");
              onSortChange("default");
            }}
            className="rounded-xl border border-white/[0.08] px-3 py-2 text-xs font-medium text-[#c7cce0] transition-colors hover:border-[#8067e8]/40 hover:bg-[#8067e8]/10"
          >
            Reset
          </button>
        ) : null}
      </div>
    </div>
  );
}

function TaskGroupPanel({
  dashboardUpdatedAt,
  group,
  collapsed,
  tasks,
  onTaskSelect,
  onToggle,
}: {
  dashboardUpdatedAt: string;
  group: TaskGroup;
  collapsed: boolean;
  tasks: readonly DashboardTask[];
  onTaskSelect: (task: DashboardTask) => void;
  onToggle: () => void;
}) {
  const styles = groupToneStyles[group.tone];
  const Icon = group.icon;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border shadow-[0_16px_48px_rgba(0,0,0,0.15)]",
        styles.panel,
      )}
    >
      <div className={cn("absolute inset-y-0 left-0 w-1", styles.accent)} />

      <button
        type="button"
        aria-expanded={!collapsed}
        onClick={onToggle}
        className="grid w-full grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-2.5 px-3 py-3 text-left transition-colors hover:bg-white/[0.035] sm:px-4"
      >
        <ChevronDown
          className={cn(
            "size-4 text-[#c7cce0] transition-transform",
            collapsed && "-rotate-90",
          )}
        />
        <span
          className={cn(
            "flex size-6 items-center justify-center rounded-full border",
            styles.icon,
          )}
        >
          <Icon className="size-3.5" />
        </span>
        <h2 className="truncate text-base font-semibold text-white sm:text-lg">
          {group.title}
        </h2>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-xs tabular-nums",
            styles.count,
          )}
        >
          {tasks.length}
        </span>
      </button>

      {!collapsed ? (
        <div className="pl-1">
          <TaskListHeader />
          <div className="divide-y divide-white/[0.065]">
            {tasks.length > 0 ? (
              tasks.map((taskItem, index) => (
                <TaskListRow
                  key={taskItem.id}
                  dashboardUpdatedAt={dashboardUpdatedAt}
                  group={group}
                  isFirst={index === 0}
                  task={taskItem}
                  onSelect={() => onTaskSelect(taskItem)}
                />
              ))
            ) : (
              <div className="px-3 py-4 text-sm text-[#8f96ad] sm:px-4">
                No tasks
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function TaskListHeader() {
  return (
    <div className="hidden grid-cols-[minmax(0,1fr)_116px_138px_112px_82px] items-center gap-3 border-y border-white/[0.065] px-3 py-2 text-xs font-medium text-[#aab1c6] lg:grid">
      <span>Task</span>
      <span>Owner</span>
      <span>Due date</span>
      <span>Priority</span>
      <span className="text-right">Meta</span>
    </div>
  );
}

function TaskListRow({
  dashboardUpdatedAt,
  group,
  isFirst,
  onSelect,
  task,
}: {
  dashboardUpdatedAt: string;
  group: TaskGroup;
  isFirst: boolean;
  onSelect: () => void;
  task: DashboardTask;
}) {
  const styles = groupToneStyles[group.tone];
  const title = getDisplayTaskTitle(task.title);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "grid min-h-11 w-full grid-cols-1 items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8067e8]/55 sm:px-4 lg:grid-cols-[minmax(0,1fr)_116px_138px_112px_82px] lg:gap-3",
        isFirst && "border-t-0",
        styles.row,
      )}
      aria-label={`Open task details for ${title}`}
    >
      <div className="min-w-0">
        <div className="flex min-w-0 items-start gap-2.5">
          <TaskGlyph />
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <h3 className="truncate font-medium text-[#f4f6ff]">{title}</h3>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#8f96ad] lg:hidden">
              <OwnerCell ownerLabel={task.ownerLabel} compact />
              <DueDateCell
                dashboardUpdatedAt={dashboardUpdatedAt}
                task={task}
              />
              <PriorityPill task={task} />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <OwnerCell ownerLabel={task.ownerLabel} />
      </div>
      <div className="hidden lg:block">
        <DueDateCell dashboardUpdatedAt={dashboardUpdatedAt} task={task} />
      </div>
      <div className="hidden lg:block">
        <PriorityPill task={task} />
      </div>
      <RowMeta />
    </button>
  );
}

function TaskGlyph() {
  return (
    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-[#aab1c6]">
      <FileText className="size-3" />
    </span>
  );
}

function OwnerCell({
  ownerLabel,
  compact = false,
}: {
  ownerLabel: DashboardTask["ownerLabel"];
  compact?: boolean;
}) {
  const owner = ownerStyles[ownerLabel];

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2",
        compact ? "text-[#aab1c6]" : "text-[#c7cce0]",
      )}
      title={ownerLabel}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold",
          owner.className,
        )}
      >
        {owner.initials}
      </span>
      <span className={cn("truncate text-xs", !compact && "hidden 2xl:block")}>
        {ownerLabel}
      </span>
    </div>
  );
}

function DueDateCell({
  dashboardUpdatedAt,
  task,
}: {
  dashboardUpdatedAt: string;
  task: DashboardTask;
}) {
  const isPastDueDate = isPastDue(task, dashboardUpdatedAt);

  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center gap-1.5 text-xs tabular-nums",
        isPastDueDate ? "text-[#ff6b6b]" : "text-[#c7cce0]",
      )}
    >
      <CalendarDays className="size-3.5 shrink-0" />
      <span className="truncate">{formatDate(task.dueDate)}</span>
    </span>
  );
}

function PriorityPill({ task }: { task: DashboardTask }) {
  if (task.normalizedStatus === "done") {
    return (
      <Badge
        variant="outline"
        className={cn(
          "rounded-md px-2 py-0.5 text-[11px]",
          priorityStyles.done,
        )}
      >
        <CheckCircle2 className="size-3" />
        Done
      </Badge>
    );
  }

  if (!task.priority) {
    return <span className="text-xs text-[#6f778d]">-</span>;
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md px-2 py-0.5 text-[11px]",
        priorityStyles[task.priority],
      )}
    >
      <Flag className="size-3" />
      {getPriorityLabel(task.priority)}
    </Badge>
  );
}

function RowMeta() {
  return (
    <div className="hidden items-center justify-end gap-3 text-xs text-[#8f96ad] lg:flex">
      <span
        aria-hidden="true"
        className="inline-flex size-5 items-center justify-center text-[#aab1c6]"
      >
        <MoreVertical className="size-4" />
      </span>
    </div>
  );
}

function DashboardRightRail({
  activity,
  meetings,
}: {
  activity: readonly AdminActivity[];
  meetings: readonly AdminMeeting[];
}) {
  return (
    <aside className="order-first grid min-w-0 gap-4 xl:order-none xl:min-h-0 xl:grid-rows-[auto_minmax(0,1fr)]">
      <MeetingsPanel meetings={meetings} />
      <ActivityPanel activity={activity} />
    </aside>
  );
}

function MeetingsPanel({ meetings }: { meetings: readonly AdminMeeting[] }) {
  const [nextMeeting, ...upcomingMeetings] = meetings;

  return (
    <Card className="overflow-hidden rounded-[18px] border-white/[0.08] bg-[#081126]/84 py-0 ring-1 ring-white/[0.04] shadow-[0_18px_56px_rgba(0,0,0,0.22)]">
      <CardHeader className="flex flex-row items-center justify-between gap-3 px-4 py-4">
        <CardTitle className="flex min-w-0 items-center gap-2 text-base text-white">
          <CalendarDays className="size-5 shrink-0 text-[#cfc4ff]" />
          <span className="truncate">Upcoming meetings</span>
        </CardTitle>
        <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-[#c7cce0]">
          View calendar
        </span>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {nextMeeting ? <FeaturedMeeting meeting={nextMeeting} /> : null}

        {upcomingMeetings.length > 0 ? (
          <div className="mt-3 border-t border-white/[0.07] pt-3">
            <div className="mb-2 text-xs text-[#aab1c6]">
              In the next 7 days
            </div>
            <div className="space-y-2.5">
              {upcomingMeetings.map((meetingItem) => (
                <CompactMeeting key={meetingItem.id} meeting={meetingItem} />
              ))}
            </div>
          </div>
        ) : null}

        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#b69cff]">
          View full calendar
          <ChevronRight className="size-4" />
        </span>
      </CardContent>
    </Card>
  );
}

function FeaturedMeeting({ meeting }: { meeting: AdminMeeting }) {
  const parts = getDateParts(meeting.date);

  return (
    <div className="rounded-[16px] border border-white/[0.08] bg-white/[0.035] p-3">
      <div className="mb-3 text-xs text-[#aab1c6]">Next client meeting</div>
      <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-3">
        <DateTile parts={parts} featured />
        <div className="min-w-0 py-1">
          <div className="line-clamp-2 text-sm font-semibold leading-5 text-white">
            {meeting.title}
          </div>
          <div className="mt-2 text-sm text-[#c7cce0]">{meeting.timeRange}</div>
          <div className="mt-1 text-sm text-[#aab1c6]">{meeting.audience}</div>
        </div>
      </div>
    </div>
  );
}

function CompactMeeting({ meeting }: { meeting: AdminMeeting }) {
  const parts = getDateParts(meeting.date);

  return (
    <div className="grid grid-cols-[58px_minmax(0,1fr)] gap-3 rounded-[14px] border border-white/[0.07] bg-white/[0.025] p-2.5">
      <DateTile parts={parts} />
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-white">
          {meeting.title}
        </div>
        <div className="mt-1 text-xs text-[#aab1c6]">{meeting.timeRange}</div>
      </div>
    </div>
  );
}

function DateTile({
  featured = false,
  parts,
}: {
  featured?: boolean;
  parts: ReturnType<typeof getDateParts>;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-[#8067e8]/24 bg-[#8067e8]/13 text-center",
        featured ? "min-h-[86px]" : "min-h-[58px]",
      )}
    >
      <div className="text-xs uppercase text-[#cfc4ff]">{parts.month}</div>
      <div
        className={cn(
          "font-semibold leading-none text-white",
          featured ? "text-3xl" : "text-xl",
        )}
      >
        {parts.day}
      </div>
      <div className="mt-1 text-xs uppercase text-[#aab1c6]">
        {parts.weekday}
      </div>
    </div>
  );
}

function ActivityPanel({ activity }: { activity: readonly AdminActivity[] }) {
  return (
    <Card className="flex min-h-0 flex-col overflow-hidden rounded-[18px] border-white/[0.08] bg-[#081126]/84 py-0 ring-1 ring-white/[0.04] shadow-[0_18px_56px_rgba(0,0,0,0.22)]">
      <CardHeader className="shrink-0 px-4 py-4">
        <CardTitle className="flex items-center gap-2 text-base text-white">
          <Zap className="size-5 text-[#cfc4ff]" />
          Recent activity
        </CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col px-4 pb-4">
        <div className="min-h-0 flex-1 space-y-0 pr-1 xl:overflow-y-auto">
          {activity.map((activityItem) => {
            const styles = activityStyles[activityItem.kind];
            const Icon = styles.icon;

            return (
              <div
                key={activityItem.id}
                className="grid grid-cols-[40px_minmax(0,1fr)] items-start gap-3 border-b border-white/[0.07] py-3 first:pt-0 last:border-0"
              >
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full border",
                    styles.className,
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium leading-5 text-white">
                    {activityItem.title}
                  </div>
                  <div className="mt-1 text-xs leading-5 text-[#8f96ad]">
                    {activityItem.description}
                  </div>
                  <div className="mt-1 text-xs text-[#aab1c6]">
                    {formatTime(activityItem.occurredAt)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <span className="mt-4 inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[#b69cff]">
          View all activity
          <ChevronRight className="size-4" />
        </span>
      </CardContent>
    </Card>
  );
}

type AdminCounts = {
  total: number;
  inProgress: number;
  completed: number;
  queued: number;
  blocked: number;
};

function getAdminCounts(tasks: readonly DashboardTask[]): AdminCounts {
  const summary = getDashboardSummary(tasks);

  return {
    total: summary.total,
    inProgress: tasks.filter((task) => task.normalizedStatus === "in_progress")
      .length,
    completed: summary.done,
    queued: tasks.filter((task) =>
      ["not_started", "review"].includes(task.normalizedStatus),
    ).length,
    blocked: tasks.filter(
      (task) =>
        task.normalizedStatus === "blocked" ||
        task.normalizedStatus === "waiting_client" ||
        task.clientNeedsAction,
    ).length,
  };
}

function getTaskGroupId(task: DashboardTask): TaskGroupId {
  if (
    task.normalizedStatus === "blocked" ||
    task.normalizedStatus === "waiting_client" ||
    task.clientNeedsAction
  ) {
    return "blocked";
  }

  if (task.normalizedStatus === "done") {
    return "finished";
  }

  if (task.normalizedStatus === "not_started") {
    return task.isIdea ? "ideas" : "queued";
  }

  return "working";
}

function shouldShowTask(
  task: DashboardTask,
  filterValue: TaskFilterValue,
  searchQuery: string,
) {
  const groupId = getTaskGroupId(task);

  if (filterValue !== "all" && groupId !== filterValue) {
    return false;
  }

  const query = normalizeLabel(searchQuery);

  if (!query) {
    return true;
  }

  return getTaskSearchText(task, groupId).includes(query);
}

function getTaskSearchText(task: DashboardTask, groupId: TaskGroupId) {
  return normalizeLabel(
    [
      task.title,
      task.publicSummary,
      task.blockedReason,
      task.ownerLabel,
      task.priority,
      taskGroups.find((group) => group.id === groupId)?.title,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function sortTasks(
  tasks: readonly DashboardTask[],
  sortValue: TaskSortValue,
): DashboardTask[] {
  if (sortValue === "default") {
    return [...tasks];
  }

  return [...tasks].sort((first, second) => {
    switch (sortValue) {
      case "due_asc":
        return (
          compareOptionalDates(first.dueDate, second.dueDate, "asc") ||
          comparePriority(first, second) ||
          compareTitles(first, second)
        );
      case "due_desc":
        return (
          compareOptionalDates(first.dueDate, second.dueDate, "desc") ||
          comparePriority(first, second) ||
          compareTitles(first, second)
        );
      case "updated_desc":
        return (
          compareOptionalDates(first.updatedAt, second.updatedAt, "desc") ||
          compareTitles(first, second)
        );
      case "priority_desc":
        return (
          comparePriority(first, second) ||
          compareOptionalDates(first.dueDate, second.dueDate, "asc") ||
          compareTitles(first, second)
        );
      case "title_asc":
        return compareTitles(first, second);
    }
  });
}

function compareOptionalDates(
  first?: string,
  second?: string,
  direction: "asc" | "desc" = "asc",
) {
  if (!first && !second) {
    return 0;
  }

  if (!first) {
    return 1;
  }

  if (!second) {
    return -1;
  }

  return direction === "asc"
    ? first.localeCompare(second)
    : second.localeCompare(first);
}

function comparePriority(first: DashboardTask, second: DashboardTask) {
  return getPriorityRank(second.priority) - getPriorityRank(first.priority);
}

function getPriorityRank(priority: DashboardTask["priority"]) {
  return priority ? priorityRank[priority] : 0;
}

function compareTitles(first: DashboardTask, second: DashboardTask) {
  return first.title.localeCompare(second.title);
}

function getTaskFilterLabel(value: TaskFilterValue) {
  return (
    taskFilterOptions.find((option) => option.value === value)?.label ??
    "All groups"
  );
}

function getTaskSortLabel(value: TaskSortValue) {
  return (
    taskSortOptions.find((option) => option.value === value)?.label ??
    "Default order"
  );
}

function getDisplayTaskTitle(title: string) {
  return title
    .trim()
    .replace(/^subtask:\s*/i, "")
    .replace(/^[-*]\s+/, "")
    .replace(/^\u2022\s+/, "");
}

function normalizeLabel(value: string) {
  return value.trim().toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ");
}

function getDateParts(value: string) {
  const date = new Date(`${value}T00:00:00`);

  return {
    month: date.toLocaleDateString("en-US", { month: "short" }),
    day: date.toLocaleDateString("en-US", { day: "2-digit" }),
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
  };
}

function formatDate(value?: string) {
  if (!value) {
    return "-";
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
  });
}

function isPastDue(task: DashboardTask, dashboardUpdatedAt: string) {
  if (!task.dueDate || task.normalizedStatus === "done") {
    return false;
  }

  const dueDate = new Date(`${task.dueDate}T23:59:59`).getTime();
  const referenceDate = new Date(dashboardUpdatedAt).getTime();

  return Number.isFinite(dueDate) && dueDate < referenceDate;
}

function getPriorityLabel(priority: NonNullable<DashboardTask["priority"]>) {
  if (priority === "normal") {
    return "Medium";
  }

  return `${priority.charAt(0).toUpperCase()}${priority.slice(1)}`;
}

function getClientInitials(clientName: string) {
  return clientName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

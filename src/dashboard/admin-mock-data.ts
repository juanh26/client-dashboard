import type {
  ClientDashboard,
  DashboardSnapshotError,
  DashboardSnapshotSource,
  DashboardTask,
} from "@/dashboard/types";

export type AdminMeeting = {
  id: string;
  title: string;
  date: string;
  timeRange: string;
  audience: string;
};

export type AdminActivityKind = "completed" | "moved" | "blocked" | "client";

export type AdminActivity = {
  id: string;
  kind: AdminActivityKind;
  title: string;
  description: string;
  occurredAt: string;
};

export type AdminMilestoneStatus = "complete" | "in_progress" | "upcoming";

export type AdminMilestone = {
  id: string;
  title: string;
  status: AdminMilestoneStatus;
  dateLabel: string;
};

export type AdminClientDashboard = ClientDashboard & {
  accountLead: string;
  healthLabel: string;
  meetings: AdminMeeting[];
  activity: AdminActivity[];
  milestones: AdminMilestone[];
};

const snapshotUpdatedAt = "2026-05-18T14:00:00.000Z";

const demoTasks = [
  task({
    id: "demo-1",
    title: "Confirm client-visible project milestones",
    normalizedStatus: "waiting_client",
    priority: "high",
    dueDate: "2026-05-20",
    updatedAt: "2026-05-18T13:45:00.000Z",
    ownerLabel: "Client",
    publicSummary: "Waiting for milestone labels to be approved.",
    clientNeedsAction: true,
  }),
  task({
    id: "demo-2",
    title: "Build read-only ClickUp snapshot",
    normalizedStatus: "in_progress",
    priority: "high",
    dueDate: "2026-05-22",
    updatedAt: "2026-05-18T12:30:00.000Z",
    ownerLabel: "PulpSense",
    publicSummary: "Creating the projected dashboard snapshot.",
    clientNeedsAction: false,
  }),
  task({
    id: "demo-3",
    title: "Review content structure",
    normalizedStatus: "in_progress",
    priority: "normal",
    dueDate: "2026-05-23",
    updatedAt: "2026-05-18T12:05:00.000Z",
    ownerLabel: "PulpSense",
    publicSummary: "Tightening the client-safe task grouping.",
    clientNeedsAction: false,
  }),
  task({
    id: "demo-4",
    title: "Connect admin client selector",
    normalizedStatus: "in_progress",
    priority: "normal",
    dueDate: "2026-05-24",
    updatedAt: "2026-05-18T11:40:00.000Z",
    ownerLabel: "PulpSense",
    publicSummary: "Showing all configured client snapshots.",
    clientNeedsAction: false,
  }),
  task({
    id: "demo-5",
    title: "Prepare visual QA pass",
    normalizedStatus: "in_progress",
    priority: "normal",
    dueDate: "2026-05-25",
    updatedAt: "2026-05-18T11:05:00.000Z",
    ownerLabel: "PulpSense",
    publicSummary: "Preparing desktop and mobile screenshot review.",
    clientNeedsAction: false,
  }),
  task({
    id: "demo-6",
    title: "Prepare kickoff meeting agenda",
    normalizedStatus: "done",
    priority: "normal",
    dueDate: "2026-05-14",
    updatedAt: "2026-05-14T17:00:00.000Z",
    doneAt: "2026-05-14T17:00:00.000Z",
    ownerLabel: "PulpSense",
    publicSummary: "Kickoff meeting agenda is ready.",
    clientNeedsAction: false,
  }),
  task({
    id: "demo-7",
    title: "Confirm data access",
    normalizedStatus: "done",
    priority: "normal",
    dueDate: "2026-05-13",
    updatedAt: "2026-05-13T15:20:00.000Z",
    doneAt: "2026-05-13T15:20:00.000Z",
    ownerLabel: "Client",
    publicSummary: "Required delivery data access was confirmed.",
    clientNeedsAction: false,
  }),
  task({
    id: "demo-8",
    title: "Project brief and scope review",
    normalizedStatus: "done",
    priority: "normal",
    dueDate: "2026-05-12",
    updatedAt: "2026-05-12T19:10:00.000Z",
    doneAt: "2026-05-12T19:10:00.000Z",
    ownerLabel: "Client",
    publicSummary: "Scope and dashboard expectations are aligned.",
    clientNeedsAction: false,
  }),
  task({
    id: "demo-9",
    title: "Set up ClickUp workspace",
    normalizedStatus: "done",
    priority: "normal",
    dueDate: "2026-05-10",
    updatedAt: "2026-05-10T18:30:00.000Z",
    doneAt: "2026-05-10T18:30:00.000Z",
    ownerLabel: "PulpSense",
    publicSummary: "Workspace setup is complete.",
    clientNeedsAction: false,
  }),
  task({
    id: "demo-10",
    title: "Final delivery review",
    normalizedStatus: "not_started",
    priority: "low",
    dueDate: "2026-05-27",
    updatedAt: "2026-05-18T10:45:00.000Z",
    ownerLabel: "Client",
    publicSummary: "Scheduled after the build and review phase.",
    clientNeedsAction: false,
  }),
  task({
    id: "demo-11",
    title: "Documentation and handover",
    normalizedStatus: "not_started",
    priority: "low",
    dueDate: "2026-05-29",
    updatedAt: "2026-05-18T10:30:00.000Z",
    ownerLabel: "PulpSense",
    publicSummary: "Handover notes will follow the final review.",
    clientNeedsAction: false,
  }),
  task({
    id: "demo-12",
    title: "Post-launch retrospective",
    normalizedStatus: "not_started",
    priority: "low",
    dueDate: "2026-06-02",
    updatedAt: "2026-05-18T10:00:00.000Z",
    ownerLabel: "PulpSense",
    publicSummary: "Queued for after launch.",
    clientNeedsAction: false,
  }),
  task({
    id: "demo-13",
    title: "QA for dashboard metrics",
    normalizedStatus: "blocked",
    priority: "high",
    dueDate: "2026-05-25",
    updatedAt: "2026-05-17T20:35:00.000Z",
    ownerLabel: "PulpSense",
    publicSummary: "Blocked until milestone confirmation lands.",
    clientNeedsAction: false,
    blockedReason: "Blocked awaiting milestone confirmation.",
  }),
  task({
    id: "demo-14",
    title: "Client feedback on content",
    normalizedStatus: "blocked",
    priority: "normal",
    dueDate: "2026-05-26",
    updatedAt: "2026-05-17T19:10:00.000Z",
    ownerLabel: "Client",
    publicSummary: "Client review is pending.",
    clientNeedsAction: false,
    blockedReason: "Client review pending.",
  }),
];

const adminDashboards = [
  {
    clientSlug: "demo",
    clientName: "Demo Client",
    accountLead: "Nicole",
    healthLabel: "Client-safe snapshot",
    snapshotUpdatedAt,
    tasks: demoTasks,
    meetings: [
      meeting(
        "demo-meeting-1",
        "Milestone confirmation call",
        "2026-05-20",
        "10:00 - 11:00 AM ET",
        "Client + PulpSense",
      ),
      meeting(
        "demo-meeting-2",
        "Content review sync",
        "2026-05-23",
        "11:00 - 11:30 AM ET",
        "Client + PulpSense",
      ),
      meeting(
        "demo-meeting-3",
        "Final delivery review",
        "2026-05-27",
        "2:00 - 3:00 PM ET",
        "Client + PulpSense",
      ),
    ],
    activity: [
      activity(
        "demo-activity-1",
        "completed",
        "Set up ClickUp workspace",
        "Done by Nicole",
        "2026-05-18T13:42:00.000Z",
      ),
      activity(
        "demo-activity-2",
        "moved",
        "Review content structure",
        "Moved to in progress",
        "2026-05-18T13:15:00.000Z",
      ),
      activity(
        "demo-activity-3",
        "blocked",
        "QA for dashboard metrics",
        "Marked as blocked",
        "2026-05-17T20:35:00.000Z",
      ),
      activity(
        "demo-activity-4",
        "client",
        "Client feedback on content",
        "Needs client action",
        "2026-05-17T18:10:00.000Z",
      ),
    ],
    milestones: [
      milestone("demo-ms-1", "Kickoff and discovery", "complete", "May 10"),
      milestone(
        "demo-ms-2",
        "Build and review",
        "in_progress",
        "May 12 - May 23",
      ),
      milestone("demo-ms-3", "Final delivery", "upcoming", "May 27"),
      milestone(
        "demo-ms-4",
        "Handover and follow-up",
        "upcoming",
        "May 29 - Jun 2",
      ),
    ],
  },
  {
    clientSlug: "autopilot",
    clientName: "Autopilot",
    accountLead: "Juan Cruz",
    healthLabel: "Mock snapshot",
    snapshotUpdatedAt: "2026-05-18T15:20:00.000Z",
    tasks: [
      task({
        id: "autopilot-1",
        title: "Approve management-agent proposal scope",
        normalizedStatus: "waiting_client",
        priority: "high",
        dueDate: "2026-05-23",
        updatedAt: "2026-05-18T15:10:00.000Z",
        ownerLabel: "Client",
        publicSummary: "Waiting on client approval before implementation.",
        clientNeedsAction: true,
      }),
      task({
        id: "autopilot-2",
        title: "HubSpot lead re-engagement sequence review",
        normalizedStatus: "in_progress",
        priority: "normal",
        dueDate: "2026-05-24",
        updatedAt: "2026-05-18T14:20:00.000Z",
        ownerLabel: "PulpSense",
        publicSummary: "Reviewing sequence logic and public summary fields.",
        clientNeedsAction: false,
      }),
      task({
        id: "autopilot-3",
        title: "Proposal handoff package",
        normalizedStatus: "done",
        priority: "normal",
        dueDate: "2026-05-18",
        updatedAt: "2026-05-18T13:00:00.000Z",
        doneAt: "2026-05-18T13:00:00.000Z",
        ownerLabel: "PulpSense",
        publicSummary: "Proposal package is ready for review.",
        clientNeedsAction: false,
      }),
      task({
        id: "autopilot-4",
        title: "CRM credential refresh",
        normalizedStatus: "blocked",
        priority: "urgent",
        dueDate: "2026-05-22",
        updatedAt: "2026-05-18T12:40:00.000Z",
        ownerLabel: "Client",
        publicSummary:
          "Blocked until the new account credentials are confirmed.",
        clientNeedsAction: false,
        blockedReason: "Credential confirmation needed.",
      }),
      task({
        id: "autopilot-5",
        title: "Sequence-deletion investigation note",
        normalizedStatus: "done",
        priority: "normal",
        dueDate: "2026-05-18",
        updatedAt: "2026-05-18T11:35:00.000Z",
        doneAt: "2026-05-18T11:35:00.000Z",
        ownerLabel: "PulpSense",
        publicSummary: "Historical workflow context is documented.",
        clientNeedsAction: false,
      }),
      task({
        id: "autopilot-6",
        title: "Next call agenda",
        normalizedStatus: "not_started",
        priority: "low",
        dueDate: "2026-05-28",
        updatedAt: "2026-05-18T09:10:00.000Z",
        ownerLabel: "PulpSense",
        publicSummary: "Queued after proposal feedback.",
        clientNeedsAction: false,
      }),
    ],
    meetings: [
      meeting(
        "autopilot-meeting-1",
        "Management agent proposal review",
        "2026-05-23",
        "1:00 - 1:45 PM ET",
        "Autopilot + PulpSense",
      ),
      meeting(
        "autopilot-meeting-2",
        "Implementation kickoff",
        "2026-05-28",
        "12:00 - 12:30 PM ET",
        "Autopilot + PulpSense",
      ),
    ],
    activity: [
      activity(
        "autopilot-activity-1",
        "completed",
        "Proposal handoff package",
        "Done by PulpSense",
        "2026-05-18T13:00:00.000Z",
      ),
      activity(
        "autopilot-activity-2",
        "blocked",
        "CRM credential refresh",
        "Waiting on client credential confirmation",
        "2026-05-18T12:40:00.000Z",
      ),
    ],
    milestones: [
      milestone("autopilot-ms-1", "Proposal delivery", "complete", "May 18"),
      milestone("autopilot-ms-2", "Scope approval", "in_progress", "May 23"),
      milestone(
        "autopilot-ms-3",
        "Implementation kickoff",
        "upcoming",
        "May 28",
      ),
    ],
  },
  {
    clientSlug: "redomiciled",
    clientName: "Redomiciled",
    accountLead: "Juan Cruz",
    healthLabel: "Mock snapshot",
    snapshotUpdatedAt: "2026-05-18T12:50:00.000Z",
    tasks: [
      task({
        id: "redomiciled-1",
        title: "Confirm post-payment funnel handoff",
        normalizedStatus: "in_progress",
        priority: "high",
        dueDate: "2026-05-24",
        updatedAt: "2026-05-18T12:35:00.000Z",
        ownerLabel: "PulpSense",
        publicSummary: "Mapping the handoff from payment into fulfillment.",
        clientNeedsAction: false,
      }),
      task({
        id: "redomiciled-2",
        title: "Review Skool organization draft",
        normalizedStatus: "waiting_client",
        priority: "normal",
        dueDate: "2026-05-26",
        updatedAt: "2026-05-18T11:55:00.000Z",
        ownerLabel: "Client",
        publicSummary: "Client review is needed on class organization.",
        clientNeedsAction: true,
      }),
      task({
        id: "redomiciled-3",
        title: "WhatsApp context synthesis",
        normalizedStatus: "done",
        priority: "normal",
        dueDate: "2026-05-20",
        updatedAt: "2026-05-18T10:20:00.000Z",
        doneAt: "2026-05-18T10:20:00.000Z",
        ownerLabel: "PulpSense",
        publicSummary: "Source context is preserved in a safe summary.",
        clientNeedsAction: false,
      }),
      task({
        id: "redomiciled-4",
        title: "Fillout intake decision",
        normalizedStatus: "blocked",
        priority: "normal",
        dueDate: "2026-05-29",
        updatedAt: "2026-05-17T17:20:00.000Z",
        ownerLabel: "Shared",
        publicSummary: "Blocked until intake questions are finalized.",
        clientNeedsAction: false,
        blockedReason: "Needs intake decision.",
      }),
      task({
        id: "redomiciled-5",
        title: "Stripe checkout notes",
        normalizedStatus: "not_started",
        priority: "low",
        dueDate: "2026-06-01",
        updatedAt: "2026-05-17T15:40:00.000Z",
        ownerLabel: "PulpSense",
        publicSummary: "Queued after funnel handoff is approved.",
        clientNeedsAction: false,
      }),
    ],
    meetings: [
      meeting(
        "redomiciled-meeting-1",
        "Fulfillment funnel review",
        "2026-05-24",
        "3:00 - 3:45 PM ET",
        "Redomiciled + PulpSense",
      ),
    ],
    activity: [
      activity(
        "redomiciled-activity-1",
        "completed",
        "WhatsApp context synthesis",
        "Captured delivery decisions",
        "2026-05-18T10:20:00.000Z",
      ),
      activity(
        "redomiciled-activity-2",
        "client",
        "Review Skool organization draft",
        "Needs client review",
        "2026-05-18T11:55:00.000Z",
      ),
    ],
    milestones: [
      milestone("redomiciled-ms-1", "Source capture", "complete", "May 20"),
      milestone("redomiciled-ms-2", "Funnel review", "in_progress", "May 24"),
      milestone("redomiciled-ms-3", "Implementation path", "upcoming", "Jun 1"),
    ],
  },
  {
    clientSlug: "foodready",
    clientName: "FoodReady",
    accountLead: "Nicole",
    healthLabel: "Mock snapshot",
    snapshotUpdatedAt: "2026-05-18T09:35:00.000Z",
    tasks: [
      task({
        id: "foodready-1",
        title: "Audit app task labels",
        normalizedStatus: "in_progress",
        priority: "normal",
        dueDate: "2026-05-23",
        updatedAt: "2026-05-18T09:25:00.000Z",
        ownerLabel: "PulpSense",
        publicSummary: "Reviewing labels before dashboard projection.",
        clientNeedsAction: false,
      }),
      task({
        id: "foodready-2",
        title: "Confirm client-safe field list",
        normalizedStatus: "waiting_client",
        priority: "high",
        dueDate: "2026-05-24",
        updatedAt: "2026-05-18T09:05:00.000Z",
        ownerLabel: "Client",
        publicSummary: "Client needs to confirm public fields.",
        clientNeedsAction: true,
      }),
      task({
        id: "foodready-3",
        title: "Repo sidecar setup",
        normalizedStatus: "done",
        priority: "normal",
        dueDate: "2026-05-17",
        updatedAt: "2026-05-17T16:15:00.000Z",
        doneAt: "2026-05-17T16:15:00.000Z",
        ownerLabel: "PulpSense",
        publicSummary: "Repo sidecar conventions are in place.",
        clientNeedsAction: false,
      }),
      task({
        id: "foodready-4",
        title: "Dashboard pilot selection",
        normalizedStatus: "not_started",
        priority: "low",
        dueDate: "2026-05-30",
        updatedAt: "2026-05-17T14:45:00.000Z",
        ownerLabel: "Shared",
        publicSummary: "Queued after the field list is confirmed.",
        clientNeedsAction: false,
      }),
    ],
    meetings: [
      meeting(
        "foodready-meeting-1",
        "Dashboard pilot check",
        "2026-05-24",
        "9:30 - 10:00 AM ET",
        "FoodReady + PulpSense",
      ),
    ],
    activity: [
      activity(
        "foodready-activity-1",
        "moved",
        "Audit app task labels",
        "Moved to in progress",
        "2026-05-18T09:25:00.000Z",
      ),
      activity(
        "foodready-activity-2",
        "client",
        "Confirm client-safe field list",
        "Needs client confirmation",
        "2026-05-18T09:05:00.000Z",
      ),
    ],
    milestones: [
      milestone("foodready-ms-1", "Sidecar setup", "complete", "May 17"),
      milestone("foodready-ms-2", "Field review", "in_progress", "May 24"),
      milestone("foodready-ms-3", "Pilot decision", "upcoming", "May 30"),
    ],
  },
] satisfies AdminClientDashboard[];

export function getAdminDashboards(): readonly AdminClientDashboard[] {
  return adminDashboards;
}

export function getAdminDashboardsFromSnapshot(
  clients: readonly ClientDashboard[],
  snapshot: {
    errors: readonly DashboardSnapshotError[];
    generatedAt: string;
    source: DashboardSnapshotSource;
  },
): readonly AdminClientDashboard[] {
  return clients.map((client) => {
    const template = adminDashboards.find(
      (dashboard) => dashboard.clientSlug === client.clientSlug,
    );
    const hasLiveError = snapshot.errors.some(
      (error) => error.clientSlug === client.clientSlug,
    );
    const tasks = sanitizeDashboardTasks(
      template && (snapshot.source === "mock" || hasLiveError)
        ? template.tasks
        : client.tasks,
    );

    return {
      ...client,
      accountLead: template?.accountLead ?? "PulpSense",
      activity: template?.activity ?? createActivityFromTasks(tasks),
      healthLabel: getHealthLabel(snapshot.source, hasLiveError),
      meetings: template?.meetings ?? [],
      milestones: template?.milestones ?? createMilestonesFromTasks(tasks),
      snapshotUpdatedAt: client.snapshotUpdatedAt || snapshot.generatedAt,
      tasks,
    };
  });
}

function getHealthLabel(
  source: DashboardSnapshotSource,
  hasLiveError: boolean,
) {
  if (hasLiveError) {
    return "Mock fallback after live read error";
  }

  if (source === "clickup") {
    return "Live client-safe snapshot";
  }

  if (source === "mixed") {
    return "Client-safe snapshot";
  }

  return "Client-safe mock snapshot";
}

function createActivityFromTasks(
  tasks: readonly DashboardTask[],
): AdminActivity[] {
  return tasks.slice(0, 4).map((taskItem) => ({
    id: `${taskItem.id}-activity`,
    description: taskItem.blockedReason ?? statusDescription(taskItem),
    kind: taskItem.clientNeedsAction
      ? "client"
      : taskItem.normalizedStatus === "blocked"
        ? "blocked"
        : taskItem.normalizedStatus === "done"
          ? "completed"
          : "moved",
    occurredAt: taskItem.updatedAt,
    title: taskItem.title,
  }));
}

function createMilestonesFromTasks(
  tasks: readonly DashboardTask[],
): AdminMilestone[] {
  return [
    milestone("generated-ms-1", "Delivered work", "complete", "Current"),
    milestone(
      "generated-ms-2",
      "Active delivery",
      tasks.some((taskItem) => taskItem.normalizedStatus === "in_progress")
        ? "in_progress"
        : "upcoming",
      "Current",
    ),
    milestone("generated-ms-3", "Next handoff", "upcoming", "Upcoming"),
  ];
}

function statusDescription(taskItem: DashboardTask) {
  if (taskItem.normalizedStatus === "done") {
    return "Done in the client-safe snapshot";
  }

  if (taskItem.normalizedStatus === "blocked") {
    return "Marked as blocked";
  }

  if (taskItem.clientNeedsAction) {
    return "Needs client action";
  }

  return "Updated in the client-safe snapshot";
}

function task(value: DashboardTask): DashboardTask {
  return stripRawStatus(value);
}

function sanitizeDashboardTasks(
  tasks: readonly DashboardTask[],
): DashboardTask[] {
  return tasks.map(stripRawStatus);
}

function stripRawStatus(taskItem: DashboardTask): DashboardTask {
  const { rawStatus: _rawStatus, ...publicTask } = taskItem as DashboardTask & {
    rawStatus?: string;
  };

  return publicTask;
}

function meeting(
  id: string,
  title: string,
  date: string,
  timeRange: string,
  audience: string,
): AdminMeeting {
  return { id, title, date, timeRange, audience };
}

function activity(
  id: string,
  kind: AdminActivityKind,
  title: string,
  description: string,
  occurredAt: string,
): AdminActivity {
  return { id, kind, title, description, occurredAt };
}

function milestone(
  id: string,
  title: string,
  status: AdminMilestoneStatus,
  dateLabel: string,
): AdminMilestone {
  return { id, title, status, dateLabel };
}

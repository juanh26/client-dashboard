import "server-only";

import { parseClickUpTaskPage, type ClickUpTask } from "@/clickup/schemas";

const CLICKUP_API_BASE_URL = "https://api.clickup.com/api/v2";
const DEFAULT_MAX_PAGES = 20;
const DEFAULT_REVALIDATE_SECONDS = 300;

type NextFetchInit = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

type FetchImplementation = (
  input: string | URL,
  init?: NextFetchInit,
) => Promise<Response>;

export type ClickUpPageEvent = {
  listId: string;
  page: number;
  taskCount: number;
  lastPage: boolean;
};

export type FetchClickUpTasksForListOptions = {
  token: string;
  listId: string;
  includeClosed?: boolean;
  subtasks?: boolean;
  maxPages?: number;
  revalidateSeconds?: number;
  fetchImpl?: FetchImplementation;
  onPage?: (event: ClickUpPageEvent) => void | Promise<void>;
};

export type FetchClickUpTasksForListsOptions = Omit<
  FetchClickUpTasksForListOptions,
  "listId"
> & {
  listIds: readonly string[];
};

export class ClickUpApiError extends Error {
  readonly listId: string;
  readonly page?: number;
  readonly status?: number;

  constructor(
    message: string,
    options: {
      listId: string;
      page?: number;
      status?: number;
      cause?: unknown;
    },
  ) {
    super(message, { cause: options.cause });
    this.name = "ClickUpApiError";
    this.listId = options.listId;
    this.page = options.page;
    this.status = options.status;
  }
}

export async function fetchClickUpTasksForLists({
  listIds,
  ...options
}: FetchClickUpTasksForListsOptions): Promise<ClickUpTask[]> {
  const taskGroups = await Promise.all(
    listIds.map((listId) => fetchClickUpTasksForList({ ...options, listId })),
  );

  return taskGroups.flat();
}

export async function fetchClickUpTasksForList({
  token,
  listId,
  includeClosed = true,
  subtasks = true,
  maxPages = DEFAULT_MAX_PAGES,
  revalidateSeconds = DEFAULT_REVALIDATE_SECONDS,
  fetchImpl = fetch,
  onPage,
}: FetchClickUpTasksForListOptions): Promise<ClickUpTask[]> {
  const tasks: ClickUpTask[] = [];

  for (let page = 0; page < maxPages; page += 1) {
    const url = buildGetTasksUrl({ listId, includeClosed, subtasks, page });
    const response = await fetchImpl(url, {
      method: "GET",
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
      next: {
        revalidate: revalidateSeconds,
        tags: [`clickup-list-${listId}`],
      },
    });

    if (!response.ok) {
      throw new ClickUpApiError("ClickUp request failed", {
        listId,
        page,
        status: response.status,
      });
    }

    const payload: unknown = await response.json();
    const parsedPage = parseTaskPage(payload, listId, page);

    tasks.push(...parsedPage.tasks);

    await onPage?.({
      listId,
      page,
      taskCount: parsedPage.tasks.length,
      lastPage: parsedPage.lastPage,
    });

    if (parsedPage.lastPage || parsedPage.tasks.length === 0) {
      return tasks;
    }
  }

  throw new ClickUpApiError(
    "ClickUp pagination exceeded the maximum page cap",
    {
      listId,
      page: maxPages,
    },
  );
}

function buildGetTasksUrl({
  listId,
  includeClosed,
  subtasks,
  page,
}: {
  listId: string;
  includeClosed: boolean;
  subtasks: boolean;
  page: number;
}): URL {
  const url = new URL(`${CLICKUP_API_BASE_URL}/list/${listId}/task`);

  url.searchParams.set("include_closed", String(includeClosed));
  url.searchParams.set("subtasks", String(subtasks));
  url.searchParams.set("order_by", "updated");
  url.searchParams.set("reverse", "true");
  url.searchParams.set("page", String(page));

  return url;
}

function parseTaskPage(
  payload: unknown,
  listId: string,
  page: number,
): ReturnType<typeof parseClickUpTaskPage> {
  try {
    return parseClickUpTaskPage(payload);
  } catch (error) {
    throw new ClickUpApiError("ClickUp response validation failed", {
      listId,
      page,
      cause: error,
    });
  }
}

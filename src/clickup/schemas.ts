import { z } from "zod";

const clickUpStatusSchema = z
  .object({
    status: z.string(),
  })
  .passthrough();

const clickUpPrioritySchema = z
  .object({
    priority: z.union([z.string(), z.number()]).optional(),
  })
  .passthrough();

const clickUpTagSchema = z
  .object({
    name: z.string(),
  })
  .passthrough();

const clickUpCustomFieldSchema = z
  .object({
    name: z.string().optional(),
    value: z.unknown().optional(),
  })
  .passthrough();

export const clickUpTaskSchema = z
  .object({
    id: z.string(),
    name: z.string().optional().default("Untitled task"),
    url: z.string().optional(),
    status: clickUpStatusSchema.nullish(),
    priority: clickUpPrioritySchema.nullish(),
    due_date: z.union([z.string(), z.number()]).nullish(),
    date_updated: z.union([z.string(), z.number()]).nullish(),
    date_done: z.union([z.string(), z.number()]).nullish(),
    tags: z
      .array(clickUpTagSchema)
      .nullish()
      .transform((tags) => tags ?? []),
    custom_fields: z
      .array(clickUpCustomFieldSchema)
      .nullish()
      .transform((customFields) => customFields ?? []),
  })
  .passthrough();

const clickUpTaskPageSchema = z
  .object({
    tasks: z.array(clickUpTaskSchema),
    last_page: z.boolean().optional(),
  })
  .passthrough();

export type ClickUpTask = z.infer<typeof clickUpTaskSchema>;
export type ClickUpCustomField = z.infer<typeof clickUpCustomFieldSchema>;

export type ClickUpTaskPage = {
  tasks: ClickUpTask[];
  lastPage: boolean;
};

export function parseClickUpTask(payload: unknown): ClickUpTask {
  return clickUpTaskSchema.parse(payload);
}

export function parseClickUpTaskPage(payload: unknown): ClickUpTaskPage {
  const parsed = clickUpTaskPageSchema.parse(payload);

  return {
    tasks: parsed.tasks,
    lastPage: parsed.last_page ?? parsed.tasks.length === 0,
  };
}

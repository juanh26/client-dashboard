import type { ClickUpCustomField, ClickUpTask } from "@/clickup/schemas";

export function getNormalizedTagNames(task: ClickUpTask): string[] {
  return task.tags.map((tag) => normalizeFieldName(tag.name));
}

export function hasTruthyCustomField(
  task: ClickUpTask,
  fieldNames: readonly string[],
): boolean {
  return findCustomField(task, fieldNames).some((field) =>
    isTruthyFieldValue(field.value),
  );
}

export function hasFalsyCustomField(
  task: ClickUpTask,
  fieldNames: readonly string[],
): boolean {
  return findCustomField(task, fieldNames).some((field) =>
    isFalsyFieldValue(field.value),
  );
}

export function getStringCustomField(
  task: ClickUpTask,
  fieldNames: readonly string[],
  maxLength = 280,
): string | undefined {
  for (const field of findCustomField(task, fieldNames)) {
    const value = fieldValueToString(field.value);

    if (value) {
      return truncateText(value, maxLength);
    }
  }

  return undefined;
}

export function normalizeFieldName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\?+$/g, "")
    .replace(/\s+/g, " ");
}

function findCustomField(
  task: ClickUpTask,
  fieldNames: readonly string[],
): ClickUpCustomField[] {
  const normalizedNames = fieldNames.map(normalizeFieldName);

  return task.custom_fields.filter((field) => {
    if (!field.name) {
      return false;
    }

    return normalizedNames.includes(normalizeFieldName(field.name));
  });
}

function isTruthyFieldValue(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value !== 0;
  }

  if (typeof value === "string") {
    return ["1", "true", "yes", "y", "visible", "public"].includes(
      normalizeFieldName(value),
    );
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (isRecord(value)) {
    if (typeof value.checked === "boolean") {
      return value.checked;
    }

    if ("value" in value) {
      return isTruthyFieldValue(value.value);
    }

    if ("name" in value) {
      return isTruthyFieldValue(value.name);
    }
  }

  return false;
}

function isFalsyFieldValue(value: unknown): boolean {
  if (typeof value === "boolean") {
    return !value;
  }

  if (typeof value === "number") {
    return value === 0;
  }

  if (typeof value === "string") {
    return ["0", "false", "no", "n", "hidden", "private"].includes(
      normalizeFieldName(value),
    );
  }

  if (isRecord(value)) {
    if (typeof value.checked === "boolean") {
      return !value.checked;
    }

    if ("value" in value) {
      return isFalsyFieldValue(value.value);
    }

    if ("name" in value) {
      return isFalsyFieldValue(value.name);
    }
  }

  return false;
}

function fieldValueToString(value: unknown): string | undefined {
  if (typeof value === "string") {
    return normalizeText(value);
  }

  if (typeof value === "number") {
    return normalizeText(String(value));
  }

  if (isRecord(value)) {
    for (const key of ["text", "label", "name", "value"]) {
      const nestedValue = value[key];
      const nestedText = fieldValueToString(nestedValue);

      if (nestedText) {
        return nestedText;
      }
    }
  }

  return undefined;
}

function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}...`;
}

function normalizeText(value: string): string | undefined {
  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized ? normalized : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

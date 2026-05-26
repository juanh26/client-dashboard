import type { ClickUpTask } from "@/clickup/schemas";
import {
  getNormalizedTagNames,
  hasFalsyCustomField,
  hasTruthyCustomField,
} from "@/dashboard/projection/clickup-fields";

const hiddenTagNames = ["hidden from client", "internal", "internal only"];
const internalFieldNames = ["Internal?", "Internal", "Internal Only?"];
const clientVisibleFieldNames = [
  "Client Visible?",
  "Client Dashboard Visible?",
  "Dashboard Visible?",
];

export function shouldHideClickUpTask(task: ClickUpTask): boolean {
  const tagNames = getNormalizedTagNames(task);

  if (tagNames.some((tagName) => hiddenTagNames.includes(tagName))) {
    return true;
  }

  if (hasTruthyCustomField(task, internalFieldNames)) {
    return true;
  }

  return hasFalsyCustomField(task, clientVisibleFieldNames);
}

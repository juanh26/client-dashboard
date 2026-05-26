import "server-only";

export function getClickUpApiToken(): string | undefined {
  const token = process.env.CLICKUP_API_TOKEN?.trim();
  return token ? token : undefined;
}

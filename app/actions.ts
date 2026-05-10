"use server";

export async function recordToolIntent(toolSlug: string) {
  // Future hook: write analytics, auth-aware usage limits, or billing events here.
  return { ok: true, toolSlug };
}

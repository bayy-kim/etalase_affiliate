"use server";

import { recordSearch } from "@/lib/data";

export async function logSearchAction(query: string): Promise<void> {
  await recordSearch(query);
}

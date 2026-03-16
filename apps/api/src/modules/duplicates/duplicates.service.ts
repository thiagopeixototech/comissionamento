import type { DuplicateGroup } from "@teleconcilia/contracts/duplicates";
import { mockDuplicateGroups } from "../../lib/mock-data";
import { fetchDuplicateGroups } from "./duplicates.repository";

export async function getDuplicateGroups(): Promise<DuplicateGroup[]> {
  try {
    return await fetchDuplicateGroups();
  } catch {
    return mockDuplicateGroups;
  }
}

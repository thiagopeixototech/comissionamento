import type { DuplicateGroup } from "@teleconcilia/contracts/duplicates";
import { mockDuplicateGroups } from "../../lib/mock-data";

export function getDuplicateGroups(): DuplicateGroup[] {
  return mockDuplicateGroups;
}

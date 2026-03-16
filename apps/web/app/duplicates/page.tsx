import { DuplicatesPage } from "../../components/pages/duplicates-page";
import { getDuplicateGroups } from "../../lib/api";

export default async function DuplicatesRoutePage() {
  const duplicateGroups = await getDuplicateGroups();

  return <DuplicatesPage duplicateGroups={duplicateGroups} />;
}

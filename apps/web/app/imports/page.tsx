import { ImportsPage } from "../../components/pages/imports-page";
import { getImports } from "../../lib/api";

export default async function ImportsRoutePage() {
  const imports = await getImports();

  return <ImportsPage imports={imports} />;
}

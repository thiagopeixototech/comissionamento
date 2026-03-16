import { MastersPage } from "../../components/pages/masters-page";
import { getCompanies, getOperators, getSellers } from "../../lib/api";

export default async function MastersRoutePage() {
  const [companies, operators, sellers] = await Promise.all([
    getCompanies(),
    getOperators(),
    getSellers()
  ]);

  return <MastersPage companies={companies} operators={operators} sellers={sellers} />;
}

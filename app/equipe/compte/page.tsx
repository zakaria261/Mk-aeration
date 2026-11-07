import { requireTeamPage } from "@/lib/cms-access";
import { TeamAccount } from "@/components/team-account";

export default async function Account() {
  return <TeamAccount member={await requireTeamPage()} />;
}

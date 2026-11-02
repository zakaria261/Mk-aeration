import { redirect } from "next/navigation";
import { cmsDb } from "@/lib/cms-db";
import { requireTeamPage } from "@/lib/cms-access";
import { TeamMembers } from "@/components/team-members";
import type { TeamMember } from "@/lib/cms-types";
export default async function Members() {
  const member = await requireTeamPage();
  if (member.role !== "admin") redirect("/equipe");
  const rows =
    await cmsDb()`SELECT email,name,role,active FROM cms_members ORDER BY created_at`;
  return <TeamMembers initial={rows as TeamMember[]} self={member.email} />;
}

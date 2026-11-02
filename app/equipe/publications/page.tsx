import { cmsDb } from "@/lib/cms-db";
import { requireTeamPage } from "@/lib/cms-access";
import type { TeamPost } from "@/lib/cms-types";
import { TeamDashboard } from "@/components/team-dashboard";
export default async function Publications() {
  const member = await requireTeamPage();
  const posts =
    await cmsDb()`SELECT * FROM cms_posts WHERE (owner_email=${member.email} OR ${member.role === "admin"}) ORDER BY updated_at DESC LIMIT 100`;
  return <TeamDashboard member={member} posts={posts as TeamPost[]} all />;
}

import { cmsDb } from "@/lib/cms-db";
import { requireTeamPage } from "@/lib/cms-access";
import type { TeamPost } from "@/lib/cms-types";
import { TeamDashboard } from "@/components/team-dashboard";
export default async function Dashboard() {
  const member = await requireTeamPage();
  const posts =
    await cmsDb()`SELECT * FROM cms_posts WHERE (owner_email=${member.email} OR ${member.role === "admin"}) ORDER BY updated_at DESC LIMIT 100`;
  const updates =
    member.role === "admin"
      ? await cmsDb()`SELECT action,created_at FROM cms_site_history ORDER BY created_at DESC LIMIT 4`
      : [];
  const newContacts =
    member.role === "admin"
      ? await cmsDb()`SELECT count(*)::int AS total FROM cms_contacts WHERE status='new'`
      : [];
  return (
    <TeamDashboard
      updates={updates.map((r) => ({
        action: String(r.action),
        date: new Date(r.created_at).toISOString(),
      }))}
      newContacts={Number(newContacts[0]?.total || 0)}
      member={member}
      posts={posts as TeamPost[]}
    />
  );
}

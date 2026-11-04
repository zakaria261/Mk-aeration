import { redirect } from "next/navigation";
import { requireTeamPage } from "@/lib/cms-access";
import { cmsDb } from "@/lib/cms-db";
import { ContactInbox, type ContactEntry } from "@/components/contact-inbox";
export default async function Inbox() {
  if ((await requireTeamPage()).role !== "admin") redirect("/equipe");
  const rows =
    await cmsDb()`SELECT id,reference,name,email,phone,message,status,created_at FROM cms_contacts ORDER BY created_at DESC LIMIT 100`;
  return (
    <ContactInbox
      initial={
        rows.map((r) => ({
          ...r,
          created_at: new Date(r.created_at).toISOString(),
        })) as ContactEntry[]
      }
    />
  );
}

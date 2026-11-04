import { redirect } from "next/navigation";
import { requireTeamPage } from "@/lib/cms-access";
import { editableSite } from "@/lib/site-content-server";
import { SiteSettingsEditor } from "@/components/site-settings-editor";
export default async function Settings() {
  if ((await requireTeamPage()).role !== "admin") redirect("/equipe");
  return <SiteSettingsEditor initial={await editableSite()} />;
}

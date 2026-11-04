import { redirect } from "next/navigation";
import { requireTeamPage } from "@/lib/cms-access";
import { editableHomePage } from "@/lib/home-content-server";
import { HomeContentEditor } from "@/components/home-content-editor";

export default async function ContentPage() {
  if ((await requireTeamPage()).role !== "admin") redirect("/equipe");
  return <HomeContentEditor initial={await editableHomePage()} />;
}

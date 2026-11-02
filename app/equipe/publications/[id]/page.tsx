import { notFound } from "next/navigation";
import { requireTeamPage } from "@/lib/cms-access";
import { editablePost } from "@/lib/cms-posts";
import { TeamEditor } from "@/components/team-editor";
export default async function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const member = await requireTeamPage();
  const { id } = await params;
  const post = await editablePost(id, member).catch((error) => {
    if (error.status === 404) notFound();
    throw error;
  });
  return <TeamEditor member={member} initial={post} />;
}

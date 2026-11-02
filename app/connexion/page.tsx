import type { Metadata } from "next";
import { cmsConfigured } from "@/lib/cms-db";
import { TeamLogin } from "@/components/team-login";
import "../equipe/team.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Connexion équipe",
  robots: { index: false, follow: false },
};
export default function SignIn() {
  return <TeamLogin enabled={cmsConfigured()} />;
}

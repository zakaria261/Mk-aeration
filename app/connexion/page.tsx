import type { Metadata } from "next";
import { cmsConfigured } from "@/lib/cms-db";
import { TeamLogin } from "@/components/team-login";
import "../equipe/team.css";
import { startupImages } from "@/lib/pwa";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Connexion équipe",
  appleWebApp: { capable: true, title: "MK Gestion", statusBarStyle: "default", startupImage: startupImages },
  robots: { index: false, follow: false },
};
export default function SignIn() {
  return <TeamLogin enabled={cmsConfigured()} />;
}

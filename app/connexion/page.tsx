import type { Metadata, Viewport } from "next";
import { cmsConfigured } from "@/lib/cms-db";
import { TeamLogin } from "@/components/team-login";
import "../equipe/team.css";
import "../equipe/ios.css";
import { startupImages } from "@/lib/pwa";
export const dynamic = "force-dynamic";
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light dark",
};
export const metadata: Metadata = {
  title: "Connexion équipe",
  appleWebApp: {
    capable: true,
    title: "MK Gestion",
    statusBarStyle: "default",
    startupImage: startupImages,
  },
  robots: { index: false, follow: false },
};
export default function SignIn() {
  return <TeamLogin enabled={cmsConfigured()} />;
}

import type { Metadata, Viewport } from "next";
import { requireTeamPage } from "@/lib/cms-access";
import { TeamShell } from "@/components/team-shell";
import "./team.css";
import "./ios.css";
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
  title: "Gestion du site",
  appleWebApp: {
    capable: true,
    title: "MK Gestion",
    statusBarStyle: "default",
    startupImage: startupImages,
  },
  robots: { index: false, follow: false },
  referrer: "same-origin",
};
export default async function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const member = await requireTeamPage();
  return <TeamShell member={member}>{children}</TeamShell>;
}

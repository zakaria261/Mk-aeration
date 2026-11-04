"use client";
import { createContext, useContext } from "react";
import type { SiteContent } from "@/lib/site-content";
import { companyLinks } from "@/lib/company";
const SiteContext = createContext<SiteContent | null>(null);
export function SiteProvider({
  content,
  children,
}: {
  content: SiteContent;
  children: React.ReactNode;
}) {
  return (
    <SiteContext.Provider value={content}>{children}</SiteContext.Provider>
  );
}
export function useSiteContent() {
  const value = useContext(SiteContext);
  if (!value) throw new Error("SiteProvider missing");
  return value;
}
export const useCompany = () => companyLinks(useSiteContent().company);

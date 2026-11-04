import type { SiteContent, SiteCompany } from "./site-content";
export function companyLinks(c: SiteContent["company"]): SiteCompany {
  return {
    ...c,
    tel: `tel:${c.phone.replace(/[ .-]/g, "")}`,
    maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.address} ${c.city}`)}`,
  };
}

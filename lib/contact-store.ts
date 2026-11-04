import "server-only";
import { createHash } from "node:crypto";
import { cmsDb } from "./cms-db";
import { CmsError } from "./cms-access";
type Input = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};
/** Stockage partagé et idempotent des contacts courts et du secours de devis. */
export async function storeContact(d: Input, ip: string, prefix = "C") {
  const sql = cmsDb();
  const existing =
    await sql`SELECT reference FROM cms_contacts WHERE id=${d.id}`;
  if (existing[0])
    return { reference: String(existing[0].reference), created: false };
  const hash = createHash("sha256")
    .update(`${new Date().toISOString().slice(0, 10)}:${ip}`)
    .digest("hex");
  const quota =
    await sql`INSERT INTO cms_rate_limits(key,count,expires_at) VALUES(${"contact:" + hash},1,now()+interval '1 day') ON CONFLICT(key) DO UPDATE SET count=cms_rate_limits.count+1 WHERE cms_rate_limits.count<5 RETURNING count`;
  if (!quota.length)
    throw new CmsError(
      429,
      "La limite de demandes est atteinte. Contactez-nous par téléphone.",
    );
  const reference = `MK-${prefix}-${d.id.slice(0, 8).toUpperCase()}`;
  await sql`INSERT INTO cms_contacts(id,reference,name,email,phone,message,ip_hash) VALUES(${d.id},${reference},${d.name},${d.email},${d.phone},${d.message},${hash}) ON CONFLICT(id) DO NOTHING`;
  return { reference, created: true };
}

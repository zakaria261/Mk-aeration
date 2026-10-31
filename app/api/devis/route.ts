import { getServerEnv, getClientIp } from "../../../lib/server-env";
import { quoteSchema, serviceNames } from "@/lib/quote-validation";
import { isSameOrigin } from "@/lib/request-security";
const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export async function POST(request: Request) {
  if (!isSameOrigin(request))
    return json({ error: "Origine de la demande non autorisée." }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return json({ error: "Format de demande non valide." }, 415);
  if (Number(request.headers.get("content-length") || 0) > 16384)
    return json({ error: "La demande est trop volumineuse." }, 413);
  try {
    const env = getServerEnv();
    const reader = request.body?.getReader();
    if (!reader) return json({ error: "Demande vide." }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 16384) {
        await reader.cancel();
        return json({ error: "La demande est trop volumineuse." }, 413);
      }
      chunks.push(value);
    }
    const body = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.length;
    }
    let input: unknown;
    try {
      input = JSON.parse(new TextDecoder().decode(body));
    } catch {
      return json({ error: "Demande illisible." }, 400);
    }
    const parsed = quoteSchema.safeParse(input);
    if (!parsed.success)
      return json({ error: parsed.error.issues[0].message }, 400);
    const d = parsed.data;
    const now = Date.now();
    if (d.startedAt > now || now - d.startedAt < 2000)
      return json(
        {
          error:
            "Prenez un instant pour vérifier votre demande, puis réessayez.",
        },
        400,
      );
    if (!env.DB)
      return json(
        {
          error:
            "Le formulaire est momentanément indisponible. Appelez le 07 68 47 61 26 ou écrivez à mk.aeration@hotmail.com.",
        },
        503,
      );
    const existing = await env.DB.prepare(
      "SELECT reference FROM quote_requests WHERE id = ?",
    )
      .bind(d.id)
      .first<{ reference: string }>();
    if (existing) return json({ reference: existing.reference });
    const ip = getClientIp(request);
    const hash = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(
        `${new Date(now).toISOString().slice(0, 10)}:${ip}`,
      ),
    );
    const ipHash = Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const recent = await env.DB.prepare(
      "SELECT count(*) as total FROM quote_requests WHERE ip_hash = ? AND created_at > ?",
    )
      .bind(ipHash, now - 3600000)
      .first<{ total: number }>();
    if ((recent?.total || 0) >= 5)
      return json(
        {
          error:
            "Plusieurs demandes ont déjà été envoyées. Contactez-nous directement par téléphone pour poursuivre.",
        },
        429,
      );
    const reference = `MK-${new Date(now).getUTCFullYear()}-${d.id.replaceAll("-", "").slice(0, 10).toUpperCase()}`;
    await env.DB.prepare(
      "INSERT INTO quote_requests (id,reference,service,profile,city,postcode,timing,description,name,company,email,phone,consent_at,created_at,ip_hash,notified) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,0) ON CONFLICT(id) DO NOTHING",
    )
      .bind(
        d.id,
        reference,
        d.service,
        d.profile,
        d.city,
        d.postcode,
        d.timing,
        d.description,
        d.name,
        d.company,
        d.email,
        d.phone,
        now,
        now,
        ipHash,
      )
      .run();
    if (env.RESEND_API_KEY && env.QUOTE_EMAIL_FROM) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
            "Idempotency-Key": d.id,
          },
          body: JSON.stringify({
            from: env.QUOTE_EMAIL_FROM,
            to: ["mk.aeration@hotmail.com"],
            reply_to: d.email,
            subject: `Nouveau devis ${reference} — ${serviceNames[d.service]}`,
            text: `Référence : ${reference}\n\n${d.name}${d.company ? ` — ${d.company}` : ""}\n${d.email}\n${d.phone}\n\n${serviceNames[d.service]}\n${d.profile}\n${d.postcode} ${d.city}\nÉchéance : ${d.timing}\n\n${d.description}`,
          }),
          signal: AbortSignal.timeout(7000),
        });
        if (response.ok)
          await env.DB.prepare(
            "UPDATE quote_requests SET notified = 1 WHERE id = ?",
          )
            .bind(d.id)
            .run();
      } catch {
        console.error("Quote notification unavailable; request remains saved.");
      }
    }
    return json({ reference }, 201);
  } catch {
    console.error("Quote request processing failed.");
    return json(
      {
        error:
          "Enregistrement impossible pour le moment. Réessayez ou appelez-nous au 07 68 47 61 26.",
      },
      503,
    );
  }
}

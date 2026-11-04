import { contactSchema } from "@/lib/contact-validation";
import {
  checkMutationOrigin,
  readCmsJson,
  CmsError,
  cmsErrorResponse,
} from "@/lib/cms-access";
import { getClientIp } from "../../../lib/server-env";
import { storeContact } from "@/lib/contact-store";
export async function POST(request: Request) {
  try {
    checkMutationOrigin(request);
    const data = contactSchema.safeParse(await readCmsJson(request, 6000));
    if (!data.success) throw new CmsError(400, data.error.issues[0].message);
    const d = data.data,
      now = Date.now();
    if (now - d.startedAt < 2000 || d.startedAt > now)
      throw new CmsError(400, "Vérifiez votre demande, puis réessayez.");
    const result = await storeContact(d, getClientIp(request));
    return Response.json(
      { reference: result.reference },
      {
        status: result.created ? 201 : 200,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (e) {
    return cmsErrorResponse(e);
  }
}

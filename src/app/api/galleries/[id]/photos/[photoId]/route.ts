import { requireUser } from "@/lib/server/auth";
import { queryOne, isUuid } from "@/lib/server/db";
import { handleError, json, notFound } from "@/lib/server/http";
import { deleteStored } from "@/lib/server/storage";

export const runtime = "nodejs";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  try {
    const { user } = await requireUser(req);
    const { id, photoId } = await params;
    if (!isUuid(id) || !isUuid(photoId)) return notFound();

    const row = await queryOne<{ image_path: string }>(
      `DELETE FROM gallery_photos p USING galleries g
       WHERE p.id = $1 AND p.gallery_id = $2 AND g.id = p.gallery_id AND g.user_id = $3
       RETURNING p.image_path`,
      [photoId, id, user.id]
    );
    if (!row) return notFound();

    await deleteStored(row.image_path);
    return json({ message: "Photo deleted successfully" });
  } catch (err) {
    return handleError(err);
  }
}

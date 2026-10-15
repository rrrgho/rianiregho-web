import { requireUser } from "@/lib/server/auth";
import { queryOne, isUuid } from "@/lib/server/db";
import { handleError, json, notFound } from "@/lib/server/http";
import { deleteStored } from "@/lib/server/storage";

export const runtime = "nodejs";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; galleryId: string }> }
) {
  try {
    const { user } = await requireUser(req);
    const { id, galleryId } = await params;
    if (!isUuid(id) || !isUuid(galleryId)) return notFound();

    const row = await queryOne<{ image_path: string }>(
      `DELETE FROM project_galleries
       WHERE id = $1 AND project_id = $2 AND user_id = $3 RETURNING image_path`,
      [galleryId, id, user.id]
    );
    if (!row) return notFound();

    await deleteStored(row.image_path);
    return json({ message: "Gallery image deleted successfully" });
  } catch (err) {
    return handleError(err);
  }
}

import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, studentFavoritesTable } from "@workspace/db";
import {
  GetFavoritesQueryParams,
  GetFavoritesResponse,
  ToggleFavoriteBody,
  ToggleFavoriteResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/favorites", async (req, res): Promise<void> => {
  const params = GetFavoritesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const rows = await db
    .select()
    .from(studentFavoritesTable)
    .where(eq(studentFavoritesTable.studentId, params.data.studentId));
  res.json(GetFavoritesResponse.parse(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))));
});

router.post("/favorites", async (req, res): Promise<void> => {
  const parsed = ToggleFavoriteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { studentId, wordId } = parsed.data;

  try {
    const [existing] = await db
      .select()
      .from(studentFavoritesTable)
      .where(
        and(
          eq(studentFavoritesTable.studentId, studentId),
          eq(studentFavoritesTable.wordId, wordId),
        ),
      );

    if (existing) {
      await db
        .delete(studentFavoritesTable)
        .where(
          and(
            eq(studentFavoritesTable.studentId, studentId),
            eq(studentFavoritesTable.wordId, wordId),
          ),
        );
      res.json(ToggleFavoriteResponse.parse({ isFavorite: false, wordId, studentId }));
      return;
    }

    await db.insert(studentFavoritesTable).values({ studentId, wordId });
    res.json(ToggleFavoriteResponse.parse({ isFavorite: true, wordId, studentId }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to toggle favorite";
    console.error("[favorites] POST failed:", message);
    res.status(500).json({ error: message });
  }
});

export default router;

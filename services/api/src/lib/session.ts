import { randomUUID } from "node:crypto";
import type { Source } from "@whv-compass/shared";
import { getDb } from "./firestore.js";

export interface SavedTurn {
  id: string;
  role: "user" | "assistant";
  text: string;
  sources: Source[];
  createdAt: string;
}

/** Persist a chat turn to Firestore (best-effort — never throws to the caller). */
export async function saveTurn(sessionId: string, turn: Omit<SavedTurn, "id" | "createdAt">): Promise<void> {
  const db = getDb();
  if (!db) return;

  const doc: SavedTurn = {
    ...turn,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };

  try {
    await db
      .collection("sessions")
      .doc(sessionId)
      .collection("messages")
      .doc(doc.id)
      .set(doc);
  } catch (err) {
    console.warn("[session] persist turn failed (best-effort):", err);
  }
}

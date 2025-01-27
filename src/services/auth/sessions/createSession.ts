"use server";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import pool from "@/lib/db/pool";
import { SessionType } from "../types";

export async function createSession(
  token: string,
  userId: string,
): Promise<SessionType> {
  if (!token || !userId) {
    throw new Error("Token and userId are required.");
  }

  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const session: SessionType = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };

  try {
    await pool.query(
      `INSERT INTO user_session (id, user_id, expires_at) VALUES ($1, $2, $3)`,
      [session.id, session.userId, session.expiresAt],
    );

    return session;
  } catch (error) {
    console.error("Error creating session:", error);
    throw new Error("Failed to create session. Please try again later.");
  }
}

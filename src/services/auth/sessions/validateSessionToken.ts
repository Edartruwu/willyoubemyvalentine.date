"use server";

import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { AuthUserType, SessionType } from "../types";
import pool from "@/lib/db/pool";
import type { PoolClient } from "pg";

const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
const REFRESH_THRESHOLD = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds

export async function validateSessionToken(token: string): Promise<{
  session: SessionType | null;
  user: Pick<AuthUserType, "id" | "name" | "userSlug"> | null;
}> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  let client: PoolClient | null = null;
  try {
    client = await pool.connect();

    const { session, user } = await fetchSessionAndUser(client, sessionId);

    if (!session || !user) {
      return { session: null, user: null };
    }

    if (isSessionExpired(session)) {
      await deleteSession(client, session.id);
      return { session: null, user: null };
    }

    if (shouldRefreshSession(session)) {
      await refreshSession(client, session);
    }

    return { session, user };
  } catch (error) {
    console.error("Error validating session token:", error);
    throw new Error("Failed to validate session token.");
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function fetchSessionAndUser(
  client: PoolClient,
  sessionId: string,
): Promise<{
  session: SessionType | null;
  user: Pick<AuthUserType, "id" | "name" | "userSlug"> | null;
}> {
  const queryText = `
    SELECT 
      us.id AS session_id, 
      us.user_id, 
      us.expires_at, 
      au.id AS user_id,
      au.name,
      au.user_slug
    FROM 
      user_session us
    INNER JOIN 
      auth_users au
    ON 
      au.id = us.user_id 
    WHERE 
      us.id = $1
  `;
  const result = await client.query(queryText, [sessionId]);

  if (result.rows.length === 0) {
    return { session: null, user: null };
  }

  const row = result.rows[0];
  const session: SessionType = {
    id: row.session_id,
    userId: row.user_id,
    expiresAt: new Date(row.expires_at),
  };

  const user: Pick<AuthUserType, "id" | "name" | "userSlug"> = {
    id: row.user_id,
    name: row.name,
    userSlug: row.user_slug,
  };

  return { session, user };
}

function isSessionExpired(session: SessionType): boolean {
  return Date.now() >= session.expiresAt.getTime();
}

function shouldRefreshSession(session: SessionType): boolean {
  return Date.now() >= session.expiresAt.getTime() - REFRESH_THRESHOLD;
}

async function deleteSession(
  client: PoolClient,
  sessionId: string,
): Promise<void> {
  await client.query("DELETE FROM user_session WHERE id = $1", [sessionId]);
}

async function refreshSession(
  client: PoolClient,
  session: SessionType,
): Promise<void> {
  const newExpiresAt = new Date(Date.now() + SESSION_DURATION);
  await client.query("UPDATE user_session SET expires_at = $1 WHERE id = $2", [
    newExpiresAt,
    session.id,
  ]);
  session.expiresAt = newExpiresAt;
}

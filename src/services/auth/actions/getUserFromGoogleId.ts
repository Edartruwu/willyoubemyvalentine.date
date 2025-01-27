"use server";

import pool from "@/lib/db/pool";
import { AuthUser, AuthUserType } from "../types";

export async function getUserFromGoogleId(
  googleId: string,
): Promise<AuthUserType | null> {
  const query = `
    SELECT 
      id, 
      google_id AS "googleId", 
      name, 
      user_slug AS "userSlug", 
      created_at AS "createdAt", 
      updated_at AS "updatedAt"
    FROM auth_users
    WHERE google_id = $1
    LIMIT 1
  `;
  const result = await pool.query(query, [googleId]);

  if (result.rows.length === 0) {
    return null;
  }

  return AuthUser.parse(result.rows[0]);
}

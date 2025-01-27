"use server";

import { generateUserSlug } from "@/lib/generateUserSlug";
import { AuthUser, AuthUserType } from "../types";
import pool from "@/lib/db/pool";

export async function createUser(
  googleId: string,
  name: string,
): Promise<AuthUserType> {
  const userSlug = generateUserSlug(name);
  const query = `
    INSERT INTO auth_users (id, google_id, name, user_slug)
    VALUES (gen_random_uuid(), $1, $2, $3)
    RETURNING 
      id, 
      google_id AS "googleId", 
      name, 
      user_slug AS "userSlug", 
      created_at AS "createdAt", 
      updated_at AS "updatedAt"
  `;
  const result = await pool.query(query, [googleId, name, userSlug]);

  return AuthUser.parse(result.rows[0]);
}

"use server";

import { AuthUser } from "../types";
import { AuthUserType } from "../types";
import pool from "@/lib/db/pool";

export async function getUser(id: string): Promise<AuthUserType> {
  try {
    const { rows } = await pool.query(
      `
      SELECT id, google_id AS "googleId", name, user_slug AS "userSlug"
      FROM auth_users
      WHERE id = $1
      `,
      [id],
    );

    if (rows.length === 0) {
      throw new Error("User not found");
    }
    const user = AuthUser.parse(rows[0]);
    return user;
  } catch (error) {
    console.error(`Error fetching user: ${error}`);
    throw new Error("Failed to fetch user");
  }
}

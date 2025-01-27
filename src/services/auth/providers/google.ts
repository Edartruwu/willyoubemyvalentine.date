import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, PUBLIC_URL } from "@/lib/env";
import { Google } from "arctic";

export const google: Google = new Google(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  PUBLIC_URL + "/api/auth/google/callback",
);

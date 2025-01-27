import { z } from "zod";

const userSlugRegex: RegExp = /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/;

export const AuthUser = z.object({
  id: z.string().uuid(),
  googleId: z.string().max(255),
  name: z.string().max(255),
  userSlug: z
    .string()
    .regex(
      userSlugRegex,
      "Invalid userSlug. It should contain only alphanumeric characters, dashes, and cannot start or end with a dash.",
    ),
  createdAt: z.preprocess((val) => new Date(val as string), z.date()),
  updatedAt: z.preprocess((val) => new Date(val as string), z.date()),
});

export type AuthUserType = z.infer<typeof AuthUser>;

export const Session = z.object({
  id: z.string().length(64),
  userId: z.string().uuid(),
  expiresAt: z.preprocess((val) => new Date(val as string), z.date()),
});

export type SessionType = z.infer<typeof Session>;

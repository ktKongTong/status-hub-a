import {z} from "@hono/zod-openapi";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().nullish(),
  emailVerified: z.date().nullish(),
  avatar: z.string().nullish(),
});
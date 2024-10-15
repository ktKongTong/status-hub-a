import {z} from "@hono/zod-openapi";

export const TokenSelectDBOSchema = z.object({
  userId: z.string(),
  identifier: z.string(),
  token: z.string(),
  expires: z.number(),
  createdAt: z.date(),
  updatedAt: z.date()
});
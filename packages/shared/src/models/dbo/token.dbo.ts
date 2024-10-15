import {z} from "@hono/zod-openapi";
import {UserSelect} from "./user.dbo";
import {TokenSelectDBOSchema} from "@/models/base/token";




export const TokenInsertDBOSchema = z.object({
  userId: z.string(),
  identifier: z.string(),
  token: z.string(),
  expires: z.number(),
});

export type UserTokenInsert = z.infer<typeof TokenInsertDBOSchema>

export type UserTokenSelect = z.infer<typeof TokenSelectDBOSchema>

export type UserAndTokenSelect = {
  user: UserSelect,
  token: UserTokenSelect
}
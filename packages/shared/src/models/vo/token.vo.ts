import {z} from "@hono/zod-openapi";
import {TokenSelectDBOSchema} from "../base/token";


export const TokenSelectVOSchema  = TokenSelectDBOSchema
  .merge(z.object({
    shortToken: z.string(),
  }))
  .omit({
    token: true,
  })

export const TokenCreateResultSchema = TokenSelectVOSchema
  .omit({
    shortToken: true,
  })
  .merge(z.object({
    token: z.string()
  }))

export const TokenCreateSchema = z.object({
  identifier: z.string(),
  expires: z.number(),
})

export type TokenInsert = z.infer<typeof TokenCreateSchema>
export type TokenCreateResult = z.infer<typeof TokenCreateResultSchema>
export type TokenSelect = z.infer<typeof TokenSelectVOSchema>
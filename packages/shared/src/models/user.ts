import {z} from "@hono/zod-openapi";

export const CurrentUserSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: z.string().email().nullish(),
    emailVerified: z.date().nullish(),
    avatar: z.string().nullish(),
  })
  .openapi("User",{
    example: {
      id: '123',
      name: 'John Doe',
      email: 'johndoe@ashallendesign.co.uk',
      emailVerified: new Date(),
      avatar: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=mail@ashallendesign.co.uk'
    }
  })

export const TokenSelectSchema  = z.object({
  userId: z.string(),
  identifier: z.string(),
  expires: z.number(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const TokenCreateResultSchema = TokenSelectSchema.merge(z.object({
  token: z.string()
}))

export const TokenCreateSchema = z.object({
  identifier: z.string(),
  expires: z.number(),
})

export type TokenInsert = z.infer<typeof TokenCreateSchema>
export type TokenCreateResult = z.infer<typeof TokenCreateResultSchema>
export type TokenSelect = z.infer<typeof TokenSelectSchema>
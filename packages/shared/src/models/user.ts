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

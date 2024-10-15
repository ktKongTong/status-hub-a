import {z} from "@hono/zod-openapi";

export const AccountInsertDBOSchema = z.object({
  userId: z.string(),
  type: z.enum(["email", "oauth", "oidc", "webauthn"]),
  provider: z.string(),
  providerAccountId: z.string(),
  refreshToken: z.string().nullish(),
  accessToken: z.string().nullish(),
  expiresAt: z.number().nullish(),
  tokenType: z.string().nullish(),
  scope: z.string().nullish(),
  idToken: z.string().nullish(),
  sessionState: z.string().nullish(),
});

export const AccountSelectDBOSchema = AccountInsertDBOSchema
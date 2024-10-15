import {createInsertSchema, createSelectSchema} from "drizzle-zod";
import {z} from "zod";
import {accounts, users, verificationTokens} from "@/db/schema/users";

export * from './credentials'
export * from './users'
export * from './credential-schema'




const insertUserSchema = createInsertSchema(users);
// const selectUserSchema = createSelectSchema(users);
type AccountInsert = typeof accounts.$inferInsert
type UserInsert = z.infer<typeof insertUserSchema>
export type AccountSelect = typeof accounts.$inferSelect
export type UserSelect = typeof users.$inferSelect

export type UserAccountInsert = {
  user: UserInsert,
  account: AccountInsert,
}

export type UserAccountSelect = {
  user: UserSelect,
  account: AccountSelect,
}

// const insertUserTokenSchema = createInsertSchema(verificationTokens);
const createUserTokenResultSchema = createSelectSchema(verificationTokens)
const selectUserTokenSchema = createUserTokenResultSchema.omit({token: true});


export type UserTokenInsert = typeof verificationTokens.$inferInsert
export type UserTokenSelect = z.infer<typeof selectUserTokenSchema>
export type UserTokenCreateResult = z.infer<typeof createUserTokenResultSchema>
export type UserAndTokenSelect = {
  user: UserSelect,
  token: UserTokenSelect
}

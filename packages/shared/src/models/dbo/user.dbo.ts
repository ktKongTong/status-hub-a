import {z} from "@hono/zod-openapi";
import {AccountInsertDBOSchema, AccountSelectDBOSchema} from "./account.dbo";
import {UserSchema} from "../base/user";


export const UserInsertDBOSchema = UserSchema

export const UserSelectDBOSchema = UserSchema


type UserInsert = z.infer<typeof UserInsertDBOSchema>
type AccountInsert = z.infer<typeof AccountInsertDBOSchema>
type AccountSelect = z.infer<typeof AccountSelectDBOSchema>

export type UserSelect = z.infer<typeof UserSelectDBOSchema>

export type UserAccountInsert = {
  user: UserInsert,
  account: AccountInsert,
}

export type UserAccountSelect = {
  user: UserSelect,
  account: AccountSelect,
}



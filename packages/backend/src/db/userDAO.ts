import {BetterSQLite3Database} from "drizzle-orm/better-sqlite3";
import {
  accounts,
  users,
  verificationTokens
} from "./schema";

import {and, eq, sql} from "drizzle-orm";
import {verifyPassword} from "@/utils";
import {
  UserAccountInsert,
  UserAccountSelect, UserAndTokenSelect,
  UserSelect,
  UserTokenInsert, UserTokenSelect,
} from 'status-hub-shared/models/dbo'
export interface IUserDAO {
  getUserByAccountId(provider: string, platformId: string): Promise<UserAccountSelect | null>;
  createNewUser(values: UserAccountInsert): Promise<UserAccountSelect>;
  getUserByUserId(userId: string): Promise<UserSelect | null>;
  createUserToken(token: UserTokenInsert): Promise<UserTokenSelect>;
  getUserTokensByUserId(userId: string):Promise<UserTokenSelect[]>;
  getUserAndTokenByToken(token: string): Promise<UserAndTokenSelect | null>;
  getValidUserAndTokenByToken(token: string): Promise<UserAndTokenSelect | null>;
  checkIfTokenIdentifierExist(identifier: string,userId: string): Promise<boolean>
  removeToken(token: string, userId: string): Promise<boolean>;
  removeTokenByIdentifier(identifier: string, userId: string): Promise<boolean>;

  checkEmailExist(email: string): Promise<boolean>;

  getUserByEmail(email: string): Promise<UserSelect | null>;
  checkEmailCredentialValid(email: string, rawPassword: string): Promise<boolean>;
}

export class UserDAO implements IUserDAO {

  constructor(private readonly db: BetterSQLite3Database){}

  async getUserByEmail(email: string): Promise<UserSelect | null> {
    const res =await this.db.select().from(users).where(and(
      eq(users.email, email)
    ))
    return res[0] ?? null;
  }
  async checkEmailCredentialValid(email: string, rawPassword: string): Promise<boolean> {
    const res = await this.db.select()
      .from(users)
      .innerJoin(accounts, eq(users.id, accounts.userId))
      .where(and(
        eq(users.email, email),
        eq(accounts.type, 'email'),
        eq(accounts.provider, 'self'),
        eq(accounts.tokenType, 'password'),
      ))
    const pw = res?.[0]?.account?.accessToken
    if (!pw) return false;
    return verifyPassword(rawPassword, pw)
  }

  async createNewUser(value: UserAccountInsert): Promise<UserAccountSelect> {
      const [user, account] = await this.db.transaction(async (tx)=> {
        const user = await tx.insert(users).values(value.user).returning()
        const account = await tx.insert(accounts).values(value.account).returning()
        return [user, account]
      });
      return {
        user: user[0],
        account: account[0],
      }
  }

  async getUserByAccountId(provider: string, platformId: string) {
    const existingUsers = await this.db.select()
      .from(users)
      .innerJoin(accounts, and(
        eq(users.id, accounts.userId),
      ))
      .where(and(
        eq(accounts.providerAccountId, platformId),
        eq(accounts.provider, provider)
      ));
    return  existingUsers[0] ?? null
  }

  async getUserByUserId(userId: string): Promise<UserSelect | null> {
    const res = await this.db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
    return res[0] ?? null
  }

  async createUserToken(token: UserTokenInsert): Promise<UserTokenSelect> {
    const res = await this.db.insert(verificationTokens).values(token).returning()
    return res[0]
  }

  async getUserTokensByUserId(userId: string):Promise<UserTokenSelect[]> {
    return this.db.select().from(verificationTokens).where(eq(verificationTokens.userId, userId));
  }

  async getUserAndTokenByToken(token: string): Promise<UserAndTokenSelect | null> {
    const res = await this.db.select({
      user: users,
      token: verificationTokens
    }).from(verificationTokens)
      .innerJoin(users, eq(users.id, verificationTokens.userId))
      .where(and(eq(verificationTokens.token, token)))
    return res[0] ?? null
  }

  async getValidUserAndTokenByToken(token: string): Promise<UserAndTokenSelect | null> {
    const res = await this.db.select({user: users, token: verificationTokens}).from(verificationTokens)
      .innerJoin(users, eq(users.id, verificationTokens.userId))
      .where(and(
        eq(verificationTokens.token, token),
        sql`${verificationTokens.createdAt} + ${verificationTokens.expires} > unixepoch()`
      ))
    return res[0] ?? null
  }
  async checkIfTokenIdentifierExist(identifier: string,userId: string): Promise<boolean> {
    const res = await this.db.select().from(verificationTokens).where(and(
      eq(verificationTokens.identifier, identifier),
      eq(verificationTokens.userId, userId)
    )).execute()
    return res.length > 0
  }
  async removeToken(token: string,userId: string): Promise<boolean> {
    const res = await this.db.delete(verificationTokens).where(and(
      eq(verificationTokens.token, token),
      eq(verificationTokens.userId, userId)
    ))
    return res.changes > 0
  }

  async removeTokenByIdentifier(identifier: string,userId: string): Promise<boolean> {
    const res = await this.db.delete(verificationTokens).where(and(
      eq(verificationTokens.identifier, identifier),
      eq(verificationTokens.userId, userId)
    ))
    return res.changes > 0
  }

  async checkEmailExist(email: string): Promise<boolean> {
    const res =await this.db.select({
      c: sql<number>`COUNT(${users.id})`
    }).from(users).where(eq(users.email, email))
    return res[0].c > 0
  }
}
import {BetterSQLite3Database} from "drizzle-orm/better-sqlite3";
import {
  accounts,
  UserAccountInsert,
  UserAccountSelect, UserAndTokenSelect,
  users,
  UserSelect, UserTokenCreateResult,
  UserTokenInsert, UserTokenSelect,
  verificationTokens
} from "./schema";
import {and, eq, sql} from "drizzle-orm";

export interface IUserDAO {
  getUserByAccountId(provider: string, platformId: string): Promise<UserAccountSelect | null>;
  createNewUser(values: UserAccountInsert): Promise<UserAccountSelect>;
  getUserByUserId(userId: string): Promise<UserSelect | null>;
  createUserToken(token: UserTokenInsert): Promise<UserTokenCreateResult>;
  getUserTokensByUserId(userId: string):Promise<UserTokenSelect[]>;
  getUserAndTokenByToken(token: string): Promise<UserAndTokenSelect | null>;
  checkIfTokenIdentifierExist(identifier: string,userId: string): Promise<boolean>
  removeToken(token: string, userId: string): Promise<boolean>;
  removeTokenByIdentifier(identifier: string, userId: string): Promise<boolean>;

  checkEmailExist(email: string): Promise<boolean>;

  getUserByEmail(email: string): Promise<UserSelect | null>;
  checkEmailCredentialValid(email: string, hashedPassword: string): Promise<boolean>;
}

export class UserDAO implements IUserDAO {

  constructor(private readonly db: BetterSQLite3Database){}

  async getUserByEmail(email: string): Promise<UserSelect | null> {
    const res =await this.db.select().from(users).where(and(
      eq(users.email, email)
    ))
    return res[0] ?? null;
  }
  async checkEmailCredentialValid(email: string, hashedPassword: string): Promise<boolean> {
    const res = await this.db.select()
      .from(users)
      .innerJoin(accounts, eq(users.id, accounts.userId))
      .where(and(
        eq(users.email, email),
        eq(accounts.type, 'email'),
        eq(accounts.provider, 'self'),
        eq(accounts.tokenType, 'password'),
        eq(accounts.accessToken, hashedPassword),
      ))
    return res[0] != null;
  }

  async createNewUser(value: UserAccountInsert): Promise<UserAccountSelect> {
      // tx
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

  async createUserToken(token: UserTokenInsert): Promise<UserTokenCreateResult> {
    const res = await this.db.insert(verificationTokens).values(token).returning()
    return res[0]
  }

  async getUserTokensByUserId(userId: string):Promise<UserTokenSelect[]> {
    return this.db.select().from(verificationTokens).where(eq(verificationTokens.userId, userId));
  }

  async getUserAndTokenByToken(token: string): Promise<UserAndTokenSelect | null> {
    const res = await this.db.select({
      user: users,
      token: {
        identifier: verificationTokens.identifier,
        userId: verificationTokens.userId,
        expires: verificationTokens.expires,
        createdAt: verificationTokens.createdAt,
        updatedAt: verificationTokens.updatedAt,
      }
    }).from(verificationTokens)
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
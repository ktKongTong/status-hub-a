import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

import {IUserDAO, UserDAO} from "./userDAO";
import { ISchemaDAO, SchemaDAO } from "./schemaDAO";
import { ICredentialDAO, CredentialDAO } from "./credentialDAO";

export class DAO {

  userDAO:IUserDAO
  schemaDAO:ISchemaDAO
  credentialDAO:ICredentialDAO

  constructor(private db: BetterSQLite3Database){
    this.userDAO = new UserDAO(this.db)
    this.schemaDAO = new SchemaDAO(this.db)
    this.credentialDAO = new CredentialDAO(this.db)
  }





}



import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

import {IUserDAO, UserDAO} from "./userDAO";
import { ISchemaDAO, SchemaDAO } from "./schemaDAO";
import { ICredentialDAO, CredentialDAO } from "./credentialDAO";
import {BizError, DbError} from "@/errors";
import {SqliteError} from "better-sqlite3";

export class DAO {

  private readonly _userDAO:IUserDAO
  private readonly _schemaDAO:ISchemaDAO
  private readonly _credentialDAO:ICredentialDAO

  constructor(private db: BetterSQLite3Database){
    this._userDAO = new UserDAO(this.db)
    this._schemaDAO = new SchemaDAO(this.db)
    this._credentialDAO = new CredentialDAO(this.db)
  }


  get userDAO() {
    return this.errorWrap(this._userDAO)
  }
  get schemaDAO() {
    return this.errorWrap(this._schemaDAO)
  }
  get credentialDAO() {
    return this.errorWrap(this._credentialDAO)
  }

  private errorWrap = <T extends object>(value:T)=> {
    let handler = {
      get: (target:any, name:any, receiver:any) => {
        return (...args:any) => new Promise((resolve, reject) => {
          const apiMethod = Reflect.get(target, name, receiver);
          const boundApiMethod = apiMethod.bind(target);
          boundApiMethod(...args).then(resolve, (e:any) => {
            reject(new DbError(e));
          });
        });
      }
    };
    return new Proxy(value, handler) as T
  }


}




export class DbError extends Error {
    error: Error
    message: string
    constructor(err: Error & {code?: string}) {
      super("DBError");
      this.message = err.message;
      this.error = err
      this.handlerCode(err.code ?? "")
      this.name = "DbError";
    }

    private handlerCode(code: string) {
      if (code === 'SQLITE_CONSTRAINT_UNIQUE') {
        this.message = 'SQLITE_CONSTRAINT_UNIQUE'
      }
    }
}


export class DBError extends Error {
  message: string
  constructor(message: any) {
    super("DBError");
    this.message = message;
    this.name = "DbError";
  }
}

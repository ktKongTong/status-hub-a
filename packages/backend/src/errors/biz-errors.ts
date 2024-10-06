// 自定义业务错误类
import {StatusCode} from "hono/utils/http-status";

abstract class BizError extends Error {
  abstract status: StatusCode
  constructor(message?: string) {
    super(message);
  }
}

export class UnknownError extends BizError {
  status: StatusCode = 500
  name = 'UnknownError'
  constructor(message?: string) {
    super(message);
  }
}

export class UnauthorizedError extends BizError {
  status: StatusCode = 401
  name = 'UnauthorizedError'
  constructor(message?: string) {
    super(message);
  }
}

export class InvalidParamError extends BizError {
  status: StatusCode = 400
  name = 'InvalidParamError'
  constructor(message?: string) {
    super(message);
  }
}

export class NotFoundError extends BizError {
  status: StatusCode = 404
  name = 'NotFoundError'
  constructor(message?: string) {
    super(message);
  }
}

export class RateLimitError extends Error {
  status: StatusCode = 429
  name = 'RateLimitError'
  constructor(message?: string) {
    super(message);
  }
}

export { BizError };
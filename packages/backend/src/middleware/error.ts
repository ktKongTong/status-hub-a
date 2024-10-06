
import { Context, Next } from 'hono';
import {logger} from "status-hub-shared/utils";
import {BizError} from "@/errors";


export const errorHandler = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (err) {

    if (err instanceof BizError) {
      c.header('X-StatusHub-Biz-Error', err.name);
      logger.error(err.stack);
      return c.json({ error: err.message }, err.status);
    } else if (err instanceof Error) {
      logger.error(err.stack);
      return c.json({ error: '服务器内部错误' }, 500);
    } else {
      logger.error(err);
      return c.json({ error: '未知错误' }, 500);
    }
  }
};


export default errorHandler;



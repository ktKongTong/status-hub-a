import {infer, never, z, ZodEffects, ZodObject, ZodType, type ZodTypeAny, ZodTypeDef} from "zod";
import {createRoute} from "@hono/zod-openapi";

type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'

type HeaderBase = ZodObject<any, any, any> | ZodType<unknown>[]
type HeaderBaseDefault = ZodObject<any, any, any> | ZodType<unknown>[]
type BodyBase = ZodType<unknown, ZodTypeDef, unknown>
type BodyBaseDefault = ZodTypeAny
type ParamBase = ZodObject<any, any, any>
type ParamBaseDefault = ZodType<any>
type QueryBase = ZodObject<any, any, any>
type QueryBaseDefault = ZodType<any>

type Maybe<T> = T | false
type Infer<T extends Maybe<unknown>> = T extends false ? never :
  T extends Maybe<infer U> ? U : T

interface RespSchema<
  RHS extends HeaderBase,
  RBS extends BodyBase,
>
{
  header?:RHS,
  body?:RBS
}
interface ReqSchema<
  RHS extends HeaderBase,
  RBS extends BodyBase,
  RPS extends ParamBase,
  RQS extends QueryBase,
> {
  header?:RHS,
  body?:RBS,
  params?:RPS,
  query?:RQS,
}

type r = Infer<Infer<BodyBase>>


class RouteOptions<
  M extends HTTPMethod,
  P extends string,
  // resp header schema
  PHS extends Maybe<HeaderBase> = HeaderBase,
  // resp body schema
  PBS extends BodyBase = BodyBaseDefault,
  QHS extends Maybe<HeaderBase> = HeaderBase,
  // request body schema
  QBS extends Maybe<BodyBase> = BodyBase,
  // request param schema
  QPS extends Maybe<ParamBase> = ParamBase,
  // request query schema
  QQS extends Maybe<QueryBase> = QueryBase,
> {

  static get<P extends string>(path?: P) {
    return new RouteOptions<'get', P>().method('get').path(path ?? "")
  }
  static post<P extends string>(path?: P) {
    return new RouteOptions<'post', P>().method('post').path(path ?? "")
  }
  static put<P extends string>(path?: P) {
    return new RouteOptions<'put', P>().method('put').path(path ?? "")
  }
  static delete<P extends string>(path?: P) {
    return new RouteOptions<'delete', P>().method('delete').path(path ?? "")
  }
  static patch<P extends string>(path?: P) {
    return new RouteOptions<'patch', P>().method('patch').path(path ?? "")
  }
  private _method: string = 'get'
  private _path: string = ''
  private _description: string = ''
  private _resp_body_schema: any  = z.any()
  private _resp_header_schema: any = z.any()
  // private _resp_params_schema: any | undefined
  // private _resp_query_schema: any | undefined
  private _req_body_schema: any = z.any()
  private _req_header_schema: any | undefined
  private _req_params_schema: any | undefined
  private _req_query_schema: any | undefined
  private method(m: HTTPMethod) {
    this._method = m
    return this
  }
  private path(p: string) {
    this._path = p
    return this
  }
  description(desc: string) {
    this._description = desc
  }

  respHeaderSchema<T extends PHS>(schema: T) {
    this._resp_header_schema = schema
    return this as unknown as RouteOptions<M, P, Infer<T>, PBS, QHS, QBS, QPS, QQS>
  }

  respBodySchema<T extends PBS>(schema: T) {
    this._resp_body_schema = schema
    return this as unknown as  RouteOptions<M, P, PHS, Infer<T>, QHS, QBS, QPS, QQS>
  }


  reqHeaderSchema<T extends QHS>(schema: T) {
    this._req_header_schema = schema
    return this as unknown as RouteOptions<M, P, PHS, PBS, Infer<T>, QBS, QPS, QQS>
  }

  reqBodySchema<T extends QBS>(schema: T) {
    this._req_body_schema = schema
    return this as unknown as  RouteOptions<M, P, PHS, PBS, QHS, Infer<T>, QPS, QQS>
  }

  reqParamSchema<T extends QPS>(schema: T) {
    this._req_params_schema = schema
    return this as unknown as  RouteOptions<M, P, PHS, PBS, QHS, QBS, Infer<T>, QQS>
  }

  reqQuerySchema<T extends QQS>(schema: T) {
    this._req_query_schema = schema
    return this as unknown as  RouteOptions<M, P, PHS, PBS, QHS, QBS, QPS, Infer<T>>
  }
  buildOpenAPIWithReqBody(desc?: string) {
    return createRoute({
      method: this._method as M,
      path: this._path as P,
      request: {
        // todo maybe undefined
        body:  {
          content: {
            'application/json': {
              schema: this._req_body_schema as Infer<QBS>
            }
          }
        },
        params: this._req_params_schema as Infer<QPS>,
        query: this._req_query_schema as Infer<QQS>,
        headers: this._req_header_schema as Infer<QHS>,
      },
      responses: {
        200: {
          content: {
            'application/json': { schema: this._resp_body_schema as Infer<PBS> },
          },
          description: desc ?? this._description,
        },
      }
    })
  }
  buildOpenAPI(desc?: string) {
    return createRoute({
      method: this._method as M,
      path: this._path as P,
      request: {
        params: this._req_params_schema as Infer<QPS>,
        query: this._req_query_schema as Infer<QQS>,
        headers: this._req_header_schema as Infer<QHS>,
      },
      responses: {
        200: {
          content: {
            'application/json': { schema: this._resp_body_schema as Infer<PBS> },
          },
          description: desc ?? this._description,
        },
      }
    })

  }
}

const example = RouteOptions
  .get('/a')
  // .buildOpenAPI('')

// import R from './route'
// export default R
export default RouteOptions
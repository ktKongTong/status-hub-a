import {githubLoginRouter} from "./github";
import {OpenAPIHono} from "@hono/zod-openapi";
import R from '@/utils/openapi'
import {SendSignUpVerificationCodeSchema, SignInByEmailSchema, SignUpByEmailSchema} from "status-hub-shared/models";
import {getDB} from "@/middleware/db";
import {InvalidParamError} from "@/errors";
import {getKV} from "@/middleware/kv";
import {createUid} from "@/utils/uid";
import {getSession} from "@/middleware/auth";
export const loginRouter = new OpenAPIHono();

loginRouter.route("/", githubLoginRouter);

loginRouter.openapi(
  R
  .post('/api/auth/sign-in/email')
  .reqBodySchema(SignInByEmailSchema)
  .buildOpenAPIWithReqBody('Sign in with email'),

  async (c) => {
  const body = c.req.valid('json')
  const {dao} = getDB(c)
  const user =await dao.userDAO.getUserByEmail(body.email)
  //
  const valid = await dao.userDAO.checkEmailCredentialValid(body.email, body.password)
    if(!user || !valid) {
      throw new InvalidParamError("invalid Param")
    }
  const userId = user.id
  // set user Cookie
  const { lucia } = getSession(c)
  const session = await lucia.createSession(userId, {});
  c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), { append: true });
  return c.json({message: "OK"}, 200)
})

loginRouter.openapi(
  R
    .post('/api/auth/sign-up/email')
    .reqBodySchema(SignUpByEmailSchema)
    .buildOpenAPIWithReqBody('Sign up with email'),
async (c) => {
    const body = c.req.valid('json')
    const {dao} = getDB(c)
    const exist = await dao.userDAO.checkEmailExist(body.email)
    if(exist) throw new InvalidParamError("该邮箱已经存在")
    const kv = getKV(c)
    const res = await kv.get<string>(`status-hub:code:sign-up:${body.email}`)
    if(res !== body.verificationCode) throw new InvalidParamError("验证码无效")
    const email = body.email
    const name = email.split('@')[0]
    const uid = createUid()
    const hashedPasswd = body.password
    const account = await dao.userDAO.createNewUser({
      user: {
        id: uid,
        name: name,
        email,
        avatar: `https://avatar.iran.liara.run/username?username=${name}`,
      },
      account: {
        userId: uid,
        type: 'email',
        provider: 'self',
        tokenType: 'password',
        accessToken: hashedPasswd,
        providerAccountId: uid,
      }
    })
    return c.json({
      message: "成功注册"
    })
})


loginRouter
  .openapi(
  R
    .post('/api/auth/sign-up/email/verification-code')
    .reqBodySchema(SendSignUpVerificationCodeSchema)
    .buildOpenAPIWithReqBody('send verification-code for Sign up  with email'),

  async (c) => {

    const body = c.req.valid('json')
    const {dao} = getDB(c)
    const exist = await dao.userDAO.checkEmailExist(body.email)
    if(exist) throw new InvalidParamError("该邮箱已经存在")
    const kv = getKV(c)
    const res = await kv.set(`status-hub:code:sign-up:${body.email}`, "000111", 60 * 5 * 1000)
    return c.json({message: "OK"}, 200)
  })
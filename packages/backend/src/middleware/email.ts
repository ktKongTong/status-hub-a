import { Resend } from 'resend';
import {env} from "@/utils/env";
import type {Context, MiddlewareHandler} from "hono";





declare module 'hono' {
  interface ContextVariableMap {
    emailSender: ReturnType<typeof send>
  }
}

// todo, convert these task to MQ message

const resend = new Resend(env('RESEND_API_KEY'))

export const getEmailSender = (c:Context) => {
  return c.get('emailSender') ?? send()
}
const sender = env('RESEND_SENDER_ADDR') as string
const send = ()=> {

  const sendVerificationCode = async (to: string, code: string) => {
    return await resend.emails.send({
      from: sender,
      to: [to],
      replyTo: sender,
      subject: '[StatusHub] Sign Up Verification Code',
      text: `here is verification code: ${code}`,
    })
  }

  return {
    sendVerificationCode
  }

}

export const EmailSenderMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    c.set('emailSender', send())
    await next()
  }
}
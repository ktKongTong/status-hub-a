import {z} from "@hono/zod-openapi";

export const SignInByEmailSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password is required').max(20),
})

export const SignUpByEmailSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  verificationCode: z.string().min(1, 'Verification code is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const SendSignUpVerificationCodeSchema = z.object({
  email: z.string().email(),
})

export type SignInByEmail = z.infer<typeof SignInByEmailSchema>
export type SignUpByEmail = z.infer<typeof SignUpByEmailSchema>
export type SendSignUpVerificationCode = z.infer<typeof SendSignUpVerificationCodeSchema>
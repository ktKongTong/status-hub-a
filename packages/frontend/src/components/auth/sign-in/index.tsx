'use client'
import React, {useState, useRef, useCallback} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { useMeasure } from "@uidotdev/usehooks";

import {SignUpByEmailSchema, SignInByEmailSchema, SignUpByEmail, SignInByEmail} from "status-hub-shared/models";
import {useSignInOrSignUp} from "@/hooks/query/useSession";


const AuthModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const signInFormRef = useRef(null);
  const signUpFormRef = useRef(null);

  const signInForm = useForm({
    resolver: zodResolver(SignInByEmailSchema),
    defaultValues: { email: '', password: '' },
  });

  const signUpForm = useForm({
    resolver: zodResolver(SignUpByEmailSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', verificationCode: '' },
  });

  const [ref, { width, height }] = useMeasure();
  const {signInByEmail, signUpByEmail, signInByOauth, getSignUpVerificationCode} = useSignInOrSignUp()
  const onSignIn = (data: SignInByEmail) => {
    signInByEmail.mutate(data)
  };
  const onSignUp = (data: SignUpByEmail) => {
    signUpByEmail.mutate(data)
  };
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const signUpEmail = signUpForm.watch('email')
  const sendVerificationCode = useCallback(() => {
    const res = z.string().email().safeParse(signUpEmail)
    if(!res.success) {
      return
    }
    getSignUpVerificationCode.mutate({email: signUpEmail})
    setIsVerificationSent(true);
    setCountdown(120);
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          setIsVerificationSent(false);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [getSignUpVerificationCode, signUpEmail]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="default">Sign In</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] h-auto transition-all duration-0" withClose={false} style={{
          maxHeight: (height ?? 1000) + 64,
        }}>
          <div ref={ref}>
          <Tabs defaultValue={'signin'} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <Form {...signInForm}>
                <form ref={signInFormRef} onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className={'flex items-center justify-between'}>
                          <FormLabel>Password</FormLabel>
                          <Button
                            variant="link"
                            type="button"
                            className="p-0 h-auto font-normal"
                            onClick={() => {
                              // Implement your forgot password logic here
                              console.log('Forgot password clicked');
                            }}
                          >
                            Forgot password?
                          </Button>
                        </div>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Sign In</Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="signup">
              <Form {...signUpForm}>
                <form ref={signUpFormRef} onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="verificationCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                          <div className={'flex items-center justify-between gap-2'}>
                            <Input type="text" {...field} />
                            <Button type={'button'} disabled={isVerificationSent} onClick={sendVerificationCode} className={'w-24'}>{isVerificationSent ? countdown:'发送验证码'}</Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">Sign Up</Button>
                </form>
              </Form>

            </TabsContent>
          </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthModal;
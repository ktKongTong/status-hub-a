import {useMutation, useQuery} from "@tanstack/react-query";
import ofetch from "@/lib/ofetch";
import {useRouter} from "next/navigation";
import {SendSignUpVerificationCode, SignInByEmail, SignUpByEmail} from "status-hub-shared/models";

const authFetch = ofetch.extend({
  retry: false,
  redirect: 'follow',
})

export const useSession = () => {
  const { data, isError, error } = useQuery({
    queryKey: ['me'],
    queryFn: () => authFetch.get('/api/user/me'),
    retry: false,
  });
  const route = useRouter();
  const loginMutation = ()=> route.push('/api/auth/login/github')
  const logoutMutation = ()=> {
    ofetch.post('/api/auth/logout').then(res => {route.push('/');})
  }
  if (data) {
    return {
      isError,
      error,
      loginMutation,
      logoutMutation,
      logged: true,
      userId: data.id,
      avatar: data.avatar,
      name: data.name,
    }
  }

  return {
    isError,
    error,
    loginMutation,
    logoutMutation,
    logged: false,
    userId: undefined,
    avatar: undefined,
    name: undefined
  };
};



export const useSignInOrSignUp = () => {

  // sign in by oauth | oidc
  // sign in by email credential
  // sign in by email otp
  const route = useRouter();
  const signInByOauth = ()=> route.push('/api/auth/login/github')

  const signInByEmail = useMutation<void, any, SignInByEmail>({
    mutationKey: ['signInByEmail'],
    mutationFn: (v)=> authFetch.post('/api/auth/sign-in/email', {
      json: v,
    })
  })

  const signUpByEmail = useMutation<void, any,SignUpByEmail>({
    mutationKey: ['signUpByEmail'],
    mutationFn: (v)=> authFetch.post('/api/auth/sign-up/email', {
      json: v,
    })
  })

  const getSignUpVerificationCode = useMutation<void, any,SendSignUpVerificationCode>({
    mutationKey: ['getSignUpVerificationCode'],
    mutationFn: (v)=> authFetch.post('/api/auth/sign-up/email/verification-code', {
      json: v,
    })
  })
  return {
    signInByOauth,
    signUpByEmail,
    signInByEmail,
    getSignUpVerificationCode,
  }
};
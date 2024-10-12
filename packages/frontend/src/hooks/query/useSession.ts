import {useMutation, useQuery} from "@tanstack/react-query";
import ofetch from "@/lib/ofetch";
import {useRouter} from "next/navigation";



export const useSession = () => {
  const { data, isError, error } = useQuery({
    queryKey: ['me'],
    queryFn: () => ofetch.get('/api/user/me'),
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
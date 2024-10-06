import {useQuery} from "@tanstack/react-query";


// fetch json, throw error
const getMe = () => fetch("/api/user/me").then(async (res)=> {
  if(res.status === 200){
    const logged = true
    const data = await res.json()
    const userId = logged ? data?.id : undefined
    const avatar = logged ? data?.avatar : undefined
    const name = logged ? data?.name : undefined
    return {
      logged,
      userId,
      avatar,
      name
    }
  }
  return {
    logged: false,
    userId: undefined,
    avatar: undefined,
    name: undefined
  }
});

export const useSession = () => {
  const { data, isError, error } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: (failureCount, error) => {
      // 不重试401错误
      if (error.message.includes('401')) {
        return false;
      }
      // 其他错误最多重试3次
      return failureCount < 3;
    }
  });
  if (data) {
    return data;
  }

  return {
    isError,
    error,
    logged: false,
    userId: undefined,
    avatar: undefined,
    name: undefined
  };
};
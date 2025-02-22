import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  TokenCreateResult, TokenInsert, TokenSelect
} from 'status-hub-shared/models/vo';
import ofetch from "@/lib/ofetch";
import { useToast } from "@/hooks/use-toast";
const API_BASE_URL = '/api/user/token';


export const useTokens = () => {
  return useQuery<TokenSelect[]>({
    queryKey: ['token'],
    queryFn: () => ofetch.get(API_BASE_URL)
  });
};

export const useCreateToken = () => {
  const queryClient = useQueryClient();
  const {toast} = useToast();
  return useMutation<TokenCreateResult, Error, TokenInsert>({
    mutationFn: async (newSchema) =>  ofetch.post(API_BASE_URL, {json: newSchema}),
    onSuccess: () => {
      toast({title: '创建成功', type:'background'})
      queryClient.invalidateQueries({ queryKey: ['token'] });
    },
    onError: (error) => {
      toast({title: '创建失败', description: error.message })
    }
  });
};


export const useDeleteToken = () => {
  const queryClient = useQueryClient();
  const {toast} = useToast();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => ofetch.delete(`${API_BASE_URL}`, {
      json: {identifier: id}
    }),
    onSuccess: () => {
      toast({title: '删除成功'})
      queryClient.invalidateQueries({ queryKey: ['token'] });
    },
  });
};

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  TokenCreateResult, TokenSelect
} from 'status-hub-shared/models';
import {z} from "zod";
const API_BASE_URL = '/api/user/token';

const createSchema = z.object({
  identifier: z.string(),
})
type TokenCreate = z.infer<typeof createSchema>
export const useTokens = () => {
  return useQuery<TokenSelect[]>({
    queryKey: ['token'],
    queryFn: async () => {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('获取凭证模式列表失败');
      }
      return response.json();
    }
  });
};

export const useCreateToken = () => {
  const queryClient = useQueryClient();
  return useMutation<TokenCreateResult, Error, TokenCreate>({
    mutationFn: async (newSchema) => {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSchema),
      });
      if (!response.ok) {
        throw new Error('创建Token失败');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['token'] });
    },
  });
};


export const useDeleteToken = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('删除凭证模式失败');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['token'] });
    },
  });
};

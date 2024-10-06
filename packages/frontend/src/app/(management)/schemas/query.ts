import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CredentialSchemaSelect, CredentialSchemaUpdate, CredentialSchemaInsert } from 'status-hub-shared/models';
const API_BASE_URL = '/api/credential-schema';


export const useCredentialSchemas = () => {
  return useQuery<CredentialSchemaSelect[]>({
    queryKey: ['credentialSchemas'],
    queryFn: async () => {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('获取凭证模式列表失败');
      }
      return response.json();
    }
  });
};

export const useCredentialSchema = (id: string) => {
  return useQuery<CredentialSchemaSelect>({
    queryKey: ['credentialSchema', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        throw new Error('获取凭证模式失败');
      }
      return response.json();
    }
  });
};

export const useCreateCredentialSchema = () => {
  const queryClient = useQueryClient();
  return useMutation<CredentialSchemaSelect, Error, CredentialSchemaInsert>({
    mutationFn: async (newSchema) => {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSchema),
      });
      if (!response.ok) {
        throw new Error('创建凭证模式失败');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentialSchemas'] });
    },
  });
};

export const useUpdateCredentialSchema = () => {
  const queryClient = useQueryClient();
  return useMutation<CredentialSchemaSelect, Error, CredentialSchemaUpdate>({
    mutationFn: async (updatedSchema) => {
      const response = await fetch(`${API_BASE_URL}/${updatedSchema.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSchema),
      });
      if (!response.ok) {
        throw new Error('更新凭证模式失败');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['credentialSchemas'] });
      queryClient.invalidateQueries({ queryKey: ['credentialSchema', data.id] });
    },
  });
};

export const useDeleteCredentialSchema = () => {
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
      queryClient.invalidateQueries({ queryKey: ['credentialSchemas'] });
    },
  });
};

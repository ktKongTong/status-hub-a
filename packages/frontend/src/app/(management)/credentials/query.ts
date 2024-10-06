import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {CredentialInsert, CredentialUpdate} from 'status-hub-shared/models'

const API_URL = '/api/credential';

async function fetchCredentials() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('获取凭证失败');
  }
  const data = await response.json();
  return data;
}

export function useCredentials() {
  return useQuery({ queryKey: ['credentials'], queryFn: fetchCredentials });
}

export function useCreateCredential() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCredential: CredentialInsert) => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCredential),
      });
      if (!response.ok) {
        throw new Error('创建凭证失败');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
    },
  });
}

export function useUpdateCredential() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedCredential: CredentialUpdate) => {
      console.log("update", updatedCredential);
      const response = await fetch(`${API_URL}/${updatedCredential.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCredential),
      });
      if (!response.ok) {
        throw new Error('更新凭证失败');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
    },
  });
}

export function useDeleteCredential() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentialId: number) => {
      const response = await fetch(`${API_URL}/${credentialId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('删除凭证失败');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
    },
  });
}
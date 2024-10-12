import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import ofetch from "@/lib/ofetch";
import {Credential, CredentialInsert, CredentialUpdate} from "status-hub-shared/models";
import {useToast} from "@/hooks/use-toast";
const API_URL = '/api/credential';


export function useCredentials() {
  return useQuery<Credential[]>({ queryKey: ['credentials'], queryFn: () => ofetch.get(API_URL) });
}


export function useCreateCredential() {
  const {toast} = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCredential: CredentialInsert) => {
      return ofetch.post(API_URL, {json: newCredential})
    },
    onSuccess: () => {
      toast({
        title: "创建成功",
      })
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
    },
  });
}



export function useUpdateCredential() {
  const queryClient = useQueryClient();
  const {toast} = useToast();
  return useMutation({
    mutationFn: async (updatedCredential: CredentialUpdate) => {
      return ofetch.put(`${API_URL}/${updatedCredential.id}`, {json: updatedCredential})
    },
    onSuccess: () => {
      toast({ title: "更新成功" })
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
    },
  });
}

export function useDeleteCredential() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentialId: number) => ofetch.delete(`${API_URL}/${credentialId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credentials'] });
    },
  });
}
import {CredentialSchemaInsert, CredentialSchemaSelect, CredentialSchemaUpdate} from "status-hub-shared/models";
import {create} from "zustand";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import ofetch from "../lib/ofetch";
import {useEffect} from "react";
import {useToast} from "@/hooks/use-toast";

const API_BASE_URL = '/api/credential-schema';

interface CredentialSchemaStore {
  schemas: CredentialSchemaSelect[]
  setSchemas: (schemas: CredentialSchemaSelect[]) => void
  addSchema: (schema: CredentialSchemaSelect) => void
  removeSchema: (id: string) => void
}

// Create our Zustand store
const useCredentialSchemaStore = create<CredentialSchemaStore>((set) => ({
  schemas: [],
  setSchemas: (schemas) => set({ schemas }),
  addSchema: (schema) => set((state) => ({ schemas: [...state.schemas, schema] })),
  removeSchema: (id) => set((state) => ({ schemas: state.schemas.filter((s) => s.id !== id) })),
}))


export const useCreateCredentialSchema = () => {
  const queryClient = useQueryClient();
  const {toast} = useToast();
  return useMutation<CredentialSchemaSelect, Error, CredentialSchemaInsert>({

    mutationFn: async (newSchema) => {
      return ofetch.post(API_BASE_URL, {json: newSchema})
    },
    onSuccess: () => {
      toast({title: '创建成功'});
      queryClient.invalidateQueries({ queryKey: ['credentialSchemas'] });
    },
    onError: error => {
      toast({title: '创建失败', description: error.message});
    }
  });
};

export const useUpdateCredentialSchema = () => {
  const {toast} = useToast();
  const queryClient = useQueryClient();
  return useMutation<CredentialSchemaSelect, Error, CredentialSchemaUpdate>({
    mutationFn: async (updatedSchema) => ofetch.put(`${API_BASE_URL}/${updatedSchema.id}`, {json: updatedSchema}),
    onSuccess: (data) => {
      toast({title: '更新成功'})
      queryClient.invalidateQueries({ queryKey: ['credentialSchemas'] });
      queryClient.invalidateQueries({ queryKey: ['credentialSchema', data.id] });
    },
  });
};

export const useDeleteCredentialSchema = () => {
  const queryClient = useQueryClient();
  const {toast} = useToast();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => { const response = await ofetch.delete(`${API_BASE_URL}/${id}`) },
    onSuccess: () => {
      toast({title: "删除成功"})
      queryClient.invalidateQueries({ queryKey: ['credentialSchemas'] });
    },
    onError: (error) => {
      toast({title: "删除失败", description: error.message});
    },
  });
};



export const useCredentialSchemas = () => {
  const queryClient = useQueryClient();
  const {toast} = useToast();
  const { schemas, setSchemas, addSchema, removeSchema:storeRemoveSchema } = useCredentialSchemaStore()
  const { data, isLoading, error,isFetching } = useQuery<CredentialSchemaSelect[]>({
    queryKey: ['credentialSchemas'],
    queryFn: ()=> ofetch.get(API_BASE_URL),
  })

  useEffect(()=>{
    if(data && data.length > 0) {
      setSchemas(data)
    }
  }, [data, setSchemas])

  const {mutate:deleteSchema, mutateAsync: deleteSchemaAsync } =  useMutation<string, Error, string>({
    mutationFn: async (id) => {await ofetch.delete(`${API_BASE_URL}/${id}`); return id},
    onSuccess: (id) => {
      storeRemoveSchema(id)
      toast({title:"删除成功"})
      queryClient.invalidateQueries({ queryKey: ['credentialSchemas'] });
    },
  });
  return {
    schemas,
    addSchema,
    deleteSchema,
    deleteSchemaAsync,
    isLoading:isLoading,
    error,
  }
}
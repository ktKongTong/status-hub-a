
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import OauthPopup from "@/components/oauth-popup";
import {Button} from "@/components/ui/button";
import React from "react";
import {Credential, SchemaField} from "status-hub-shared/models";
import {useUpdateCredential} from "@/app/(management)/credentials/query";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Switch} from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
const formSchema = z.object({
  credentialValues: z.record(z.union([z.string(), z.number() ,z.boolean()]))
})

export default function CredentialEditor(
{
  editingCredential,
  setEditingCredential
}:{
  editingCredential: Credential,
  setEditingCredential: (credential: Credential | null) => void
}
) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      credentialValues: editingCredential.credentialValues,
    }
  })
  const updateMutation = useUpdateCredential();

  const onSubmit = (v:z.infer<typeof formSchema>) => {
    updateMutation.mutateAsync({
      ...editingCredential,
      credentialValues: {
        ...editingCredential.credentialValues,
        ...v.credentialValues,
      },
    })
      .then(()=>setEditingCredential(null))
  }
  const handleOauthAutoFill = (obj: Record<string, string>) => {
    const fileds = editingCredential.schema.schemaFields
    if (fileds) {
      const credentialValues = editingCredential.schema.schemaFields.map((field: { fieldName: string }) => ({
        [field.fieldName]: obj[field.fieldName]
      })).reduce((acc: Record<string, any>, cur: Record<string, any>) => Object.assign(cur,acc), {})
      form.setValue('credentialValues', credentialValues)
    }
  };
  return (
    <Dialog open={!!editingCredential} onOpenChange={() => setEditingCredential(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑凭证</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              {editingCredential && editingCredential.schema.schemaFields.map((schemaField:any) => (
                <FormField
                  control={form.control}
                  key={schemaField.fieldName}
                  name={`credentialValues.${schemaField.fieldName}`}
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>{schemaField.fieldName}</FormLabel>
                      <FormControl>
                        {
                          schemaField.fieldType === 'boolean' ? <Switch
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                              required={schemaField.isRequired}
                            /> :
                            // @ts-ignore
                            (<Input placeholder="" {...field} required={schemaField.isRequired}/>)
                        }
                      </FormControl>
                      <FormDescription>{schemaField.description}</FormDescription>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              ))}
              <div className={'ml-auto w-full flex gap-2 flex-grow items-center justify-end'}>
                {
                  editingCredential && editingCredential.schema.createdBy === "system" && editingCredential.schema.credentialType === "oauth" &&
                    <OauthPopup
                        title={'OAuth Adapter'}
                        url={`/api/route/oauth/adapter/${editingCredential.schema.platform}`}
                        onCode={(it) => {
                          handleOauthAutoFill(JSON.parse(atob(it)))
                        }}
                        className={'w-fit'}
                        onClose={() => {
                        }}
                        height={400}
                        width={400}
                    >
                        <Button type={'button'}>OAuth 自动填充</Button>
                    </OauthPopup>
                }
                <Button type="submit">保存并更新</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
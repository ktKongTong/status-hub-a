import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import React, {useState} from "react";
import {useCreateCredential} from "@/hooks/use-credentials";
import {CredentialSchemaSelect} from "status-hub-shared/models";
import OauthPopup from "@/components/oauth-popup";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {Switch} from "@/components/ui/switch";

const formSchema = z.object({
  schemaId: z.string(),
  credentialValues: z.record(z.union([z.string(), z.number() ,z.boolean()]))
})

export default function CredentialCreateForm(
{
  schemas
}:{
  schemas: CredentialSchemaSelect[]
}
) {
  const createMutation = useCreateCredential();
  const [open,setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (v:z.infer<typeof formSchema>)=> {
    // map form schema
    const regex = /(.+)__(\d+)/
    const [, id, version] = regex.exec(v.schemaId)!
    const res = {
      schemaId: id,
      schemaVersion: parseInt(version),
      credentialValues: v.credentialValues
    }
    createMutation.mutateAsync(res).then(() => setOpen(false))
  }


  const handleOauthAutoFill = (obj: Record<string, string>) => {
    // use obj to fill editing credentialValues by schemaFields
    const fileds = curSchema!.schemaFields
    if (fileds) {
      const credentialValues = fileds.map((field: { fieldName: string }) => ({
        [field.fieldName]: obj[field.fieldName]
      })).reduce((acc: Record<string, any>, cur: Record<string, any>) => Object.assign(cur,acc), {})
      form.setValue('credentialValues', credentialValues)
    }
  };

  const curSchema = schemas.find(schema => `${schema.id}__${schema.schemaVersion}` === form.getValues('schemaId'))

  const [,setCount] = useState(0);
  const forceUpdate = ()=> setCount(c=>c+1)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4" onClick={()=>{setOpen(true)}}>创建新凭证</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>创建新凭证</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="schemaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="schemaId">凭证模式</FormLabel>
                      <Select onValueChange={(v)=>{forceUpdate();field.onChange(v);}} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="选择凭证模式"/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {schemas.map(schema => (
                            <SelectItem key={schema.id} value={`${schema.id}__${schema.schemaVersion}`}>
                              {schema.platform} - {schema.credentialType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    <FormDescription>
                      credential schema
                    </FormDescription>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              { curSchema && curSchema.schemaFields.map(schemaField => (
                <FormField
                  control={form.control}
                  key={schemaField.fieldName}
                  name={`credentialValues.${schemaField.fieldName}`}

                  render={({ field }) => (
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
                  curSchema && curSchema.createdBy === "system" && curSchema.credentialType === "oauth" &&
                    <OauthPopup
                        title= {'OAuth Adapter'}
                        url={`/api/route/oauth/adapter/${curSchema.platform}`}
                        onCode = {(it)=> {handleOauthAutoFill(JSON.parse(atob(it)))}}
                        className={'w-fit'}
                        onClose = {()=> {}}
                        height={400}
                        width={400}
                    >
                        <Button>OAuth 自动填充</Button>
                    </OauthPopup>
                }
                <Button type="submit">创建</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Switch} from "@/components/ui/switch";
import React, {FormEvent, useState} from "react";
import {useCreateCredentialSchema} from "@/hooks/use-credential-schemas"
import {CredentialSchemaInsert, CredentialSchemaInsertSchema, SchemaField} from "status-hub-shared/models";
import {DialogTriggerProps} from "@radix-ui/react-dialog";
import {useFieldArray, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {InfoCircledIcon} from "@radix-ui/react-icons";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  NamedFormMessage
} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {CircleMinus} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

type  CredentialSchemaFormProps = {
  children: React.ReactNode;
} & DialogTriggerProps & React.RefAttributes<HTMLButtonElement>


export default function CredentialSchemaFormDialog({children,  ...rest}: CredentialSchemaFormProps) {
  const createMutation = useCreateCredentialSchema();

  const [open, setOpen] = React.useState(false);


  const form = useForm<z.infer<typeof CredentialSchemaInsertSchema>>({
    resolver: zodResolver(CredentialSchemaInsertSchema),
    defaultValues: {
      schemaFields: [],
      available: true,
      description: '',
      availablePermissions: '',
      permissions: '',
    },
  })
  const handleCreateSchema = (v:CredentialSchemaInsert) => {
    setOpen(false);
    form.reset()
    createMutation.mutate(v);
  };
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control: form.control,
    name: "schemaFields",
  });
  const addEmptyField = () => append({
    fieldName: '',
    fieldType: 'string',
    isRequired: true,
    description: ''
  })
  return<Dialog open={open} onOpenChange={() => setOpen(s=>!s)}>
    <DialogTrigger {...rest}>
      {children}
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>创建新凭证模式</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <Form {...form} >
          <form className={'grid gap-2'} onSubmit={form.handleSubmit(handleCreateSchema)}>
            <div className={' items-center flex justify-between gap-2'}>
              <FormField
                control={form.control}
                name={'available'}
                render={({field}) => (
                  <FormItem className={'col-span-1 items-center gap-2 space-y-0'}>
                    <div className={'flex items-center gap-2'}>
                      <FormLabel>可用</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange}/>
                      </FormControl>
                    </div>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <div className={'flex items-end justify-between gap-2'}>
                <Label>用户Schema</Label>
                <div className={'flex items-center gap-2'}>
                  <div className={'flex items-center gap-2'}>
                    <Popover>
                      <PopoverTrigger><InfoCircledIcon/></PopoverTrigger>
                      <PopoverContent className={'w-full'}>
                        <FormDescription>
                          当Schema 的字段进行更新时，会自动更新版本
                        </FormDescription>
                      </PopoverContent>
                    </Popover>
                    <FormLabel>凭证版本</FormLabel>
                  </div>
                  <Label>1</Label>
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name={'platform'}
              render={({field}) => (
                <FormItem className={'col-span-1'}>
                  <div className={'flex items-center gap-2'}>
                    <FormLabel>平台</FormLabel>
                    <InfoCircledIcon/>
                  </div>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={'credentialType'}
              render={({field}) => (
                <FormItem className={'col-span-1'}>
                  <div className={'flex items-center gap-2'}>
                    <FormLabel>凭证类型</FormLabel>
                    <Popover>
                      <PopoverTrigger><InfoCircledIcon/></PopoverTrigger>
                      <PopoverContent className={'w-full'}>
                        <FormDescription>
                          如：Cookie，oauth，apiToken
                        </FormDescription>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'maximumRefreshIntervalInSec'}
              render={({field}) => (
                <FormItem>
                  <div className={'flex justify-between'}>
                    <div className={'flex items-center gap-2'}>
                      <FormLabel>最大刷新间隔(秒)</FormLabel>
                      <Popover>
                        <PopoverTrigger><InfoCircledIcon/></PopoverTrigger>
                        <PopoverContent className={'w-full'}>
                          <FormDescription>
                            如果配置为可刷新，系统会根据该字段在合适的时机进行刷新操作
                          </FormDescription>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <FormField
                      control={form.control}
                      name={'autoRefreshable'}
                      render={({field}) => (
                        <FormItem className={'col-span-1 items-center gap-2 space-y-0'}>
                          <div className={'flex items-center gap-2'}>
                            <FormLabel>可自动刷新</FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange}/>
                            </FormControl>
                          </div>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormControl>
                    <Input {...field}  type={'number'} onChange={event => field.onChange(+event.target.valueAsNumber)} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={'description'}
              render={({field}) => (
                <FormItem className={'col-span-1'}>
                  <FormLabel>凭证描述</FormLabel>
                  <FormControl>
                    <div className={'relative'}>
                      <Textarea placeholder={'简单描述一下吧...'} className="resize-none" maxLength={200} {...field} />
                      <div className={'absolute right-2 bottom-0 text-primary'}>{field.value?.length}/200</div>
                    </div>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <div className={'flex items-center gap-2'}>
              <Label className={'text-lg my-2'}>字段</Label>
              <NamedFormMessage name={'schemaFields'}/>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className={'p-2'}>
                <div className={'relative  group'}>
                  <div className={'flex items-center justify-between'}>
                    <FormField
                      control={form.control}
                      name={`schemaFields.${index}.fieldName`}
                      render={({field}) => (
                        <FormItem className={'space-y-0 gap-2'}>
                          <div className={'flex items-center gap-2'}>
                            <FormLabel>名称</FormLabel>

                            <FormControl>
                              <div className={'relative'}>
                                <Input placeholder={'字段名称...'} className="resize-none" maxLength={20} {...field} />
                              </div>
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <div className={''}>
                      <Button type={'button'} onClick={() => remove(index)} size={'icon'} variant={'ghost'}><CircleMinus /></Button>
                    </div>

                  </div>
                  <div className={'flex pt-2 gap-8'}>
                    <FormField
                      control={form.control}
                      name={`schemaFields.${index}.fieldType`}
                      render={({field}) => (
                        <FormItem className={''}>
                          <div className={'flex items-center gap-2 w-full'}>
                            <FormLabel className={'w-full'}>类型</FormLabel>
                            <FormControl>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className={'ml-auto'}>
                                  <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="string">字符串</SelectItem>
                                  <SelectItem value="number">数字</SelectItem>
                                  <SelectItem value="boolean">布尔值</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`schemaFields.${index}.isRequired`}
                      render={({field}) => (
                        <FormItem className={'items-center space-y-0 flex'}>
                          <div className={'flex items-center gap-2'}>
                            <FormLabel>必填</FormLabel>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange}/>
                            </FormControl>
                          </div>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`schemaFields.${index}.description`}
                    render={({field}) => (
                      <FormItem className={'col-span-1'}>
                        <FormLabel>描述</FormLabel>
                        <FormControl>
                          <div className={'relative'}>
                            <Textarea placeholder={'简单描述一下吧...'} className="resize-none"
                                      maxLength={200} {...field} />
                          </div>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" type={'button'} onClick={addEmptyField}>添加字段</Button>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type={'button'} onClick={()=>setOpen(false)}>取消</Button>
              <Button type={'submit'}>保存</Button>
            </div>
          </form>
        </Form>
      </DialogBody>
    </DialogContent>
  </Dialog>


}
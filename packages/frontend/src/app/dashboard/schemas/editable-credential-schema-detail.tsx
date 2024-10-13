import React from "react";
import {Input} from "@/components/ui/input";
import {Switch} from "@/components/ui/switch";
import {Button} from "@/components/ui/button";
import {
  useUpdateCredentialSchema
} from "@/hooks/use-credential-schemas";
import {
  CredentialSchemaSelect,
  CredentialSchemaUpdate, CredentialSchemaUpdateSchema,
} from "status-hub-shared/models";
import {Label} from "@/components/ui/label";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage, NamedFormMessage,
  useFormField
} from "@/components/ui/form";
import {InfoCircledIcon} from "@radix-ui/react-icons";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { CircleMinus } from "lucide-react";

type EditableCredentialSchemaDetailProps = {
  schema: CredentialSchemaSelect,
  afterSave:()=> void
  afterCancel:()=> void
}

const schemaEditingFormSchema = CredentialSchemaUpdateSchema

const EditableCredentialSchemaDetail = ({ schema, afterSave, afterCancel }: EditableCredentialSchemaDetailProps) => {
  const updateMutation = useUpdateCredentialSchema();

  const handleUpdateSchema = (v:CredentialSchemaUpdate) => {
    afterSave()
    updateMutation.mutate(v);
  };

  const disabled = schema.createdBy === 'system'
  const form = useForm<z.infer<typeof schemaEditingFormSchema>>({
    resolver: zodResolver(schemaEditingFormSchema),
    defaultValues: schema,
    disabled
  })
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

  return <React.Fragment>
    <div className={'m-2'}>
        <Form {...form} >
          <form className={'grid gap-2'} onSubmit={form.handleSubmit(handleUpdateSchema)}>
            <div className={' items-center gap-2'}>
              <div className={'flex items-center justify-between gap-2'}>
                <div className={'flex items-center gap-2'}>
                  <Label>ID</Label>
                  <Label>{schema.id}</Label>
                </div>
                <div className={'flex flex-col items-end justify-center gap-2'}>
                  <Label>{schema.createdBy === 'system' ? '系统' : '用户'}Schema</Label>
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
                    <Label>{schema.schemaVersion}</Label>
                  </div>
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name={'available'}
              render={({field}) => (
                <FormItem className={'col-span-1 items-center gap-2 space-y-0'}>
                  <div className={'flex items-center gap-2'}>
                    <FormLabel>可用</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} disabled={disabled}/>
                    </FormControl>
                  </div>
                  <FormMessage/>
                </FormItem>
              )}
            />
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
                              <Switch checked={field.value} onCheckedChange={field.onChange} disabled={disabled}/>
                            </FormControl>
                          </div>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormControl>
                    <Input {...field} type={'number'}  onChange={event => field.onChange(+event.target.valueAsNumber)} />
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
                      <div className={'absolute right-2 bottom-0 text-primary'}>{field.value?.length ?? 0}/200</div>
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
                    <div className={disabled ? 'hidden':''}>
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
                              <Switch checked={field.value} onCheckedChange={field.onChange} disabled={disabled}/>
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
            <Button variant="outline" type={'button'} onClick={addEmptyField} disabled={disabled} className={disabled ? 'hidden':''}>添加字段</Button>
            {
              disabled ? (
                <Button variant="outline" type={'button'} onClick={()=>{afterCancel()}}>确认</Button>
              ):(
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" type={'button'} onClick={()=>{afterCancel()}}>取消</Button>
                  <Button disabled={disabled} type={'submit'}>保存</Button>
                </div>
              )
            }
          </form>
        </Form>
    </div>

  </React.Fragment>
}

export default EditableCredentialSchemaDetail;
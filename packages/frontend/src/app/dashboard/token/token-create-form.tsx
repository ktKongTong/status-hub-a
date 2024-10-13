import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { TokenCreateSchema } from "status-hub-shared/models";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {convertShortStrToTime, convertTimeToShortStr} from "@/app/dashboard/token/sec-converter";
const validFormSchema = TokenCreateSchema
interface TokenCreateFormProps {
  onConfirm: (v: z.infer<typeof validFormSchema>)=> void,
  onCancel?: ()=> void,
  children: React.ReactNode,
}

const TokenCreateForm = (props:TokenCreateFormProps)=> {

  const [open, setOpen] = React.useState(false);
  const onDialogCancel = ()=> {
    // onCancel?.()
    setOpen(false);
  }

  const onSubmit = (v: z.infer<typeof validFormSchema>)=> {
    props.onConfirm(v)
    setOpen(false);
  }
  const form = useForm<z.infer<typeof validFormSchema>>({
    resolver: zodResolver(validFormSchema),
    defaultValues: {
      identifier: '',
      expires: 30 * 24 * 3600
    }
  })

  return (
    <Dialog open={open} onOpenChange={() => setOpen(s=>!s)}>
      <DialogTrigger asChild>
        { props.children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>创建 Token</DialogTitle>
        </DialogHeader>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name={'identifier'}
          control={form.control}
          render={({field}) => (
            <FormItem>
              <FormLabel>名称</FormLabel>
              <FormControl>
                <Input {...field}/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )
          }>
        </FormField>
        <FormField
          name={'expires'}
          control={form.control}
          render={({field}) => (
            <FormItem>
              <FormLabel>有效期</FormLabel>
              <FormControl>
                <Select defaultValue={'30d'} value={convertTimeToShortStr(field.value)} onValueChange={(v)=>field.onChange(convertShortStrToTime(v))}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'30d'}>30天</SelectItem>
                    <SelectItem value={'60d'}>60天</SelectItem>
                    <SelectItem value={'90d'}>90天</SelectItem>
                    <SelectItem value={'365d'}>365天</SelectItem>
                    <SelectItem value={'never'}>永久有效</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )
          }>
        </FormField>
        <div className={'flex justify-end gap-2 pt-2'}>
          <Button type={'button'} onClick={onDialogCancel} variant={'ghost'}>取消</Button>
          <Button type={'submit'} variant={'ghost'}>提交</Button>
        </div>
      </form>
    </Form>

      </DialogContent>
    </Dialog>
  )
}

export default TokenCreateForm
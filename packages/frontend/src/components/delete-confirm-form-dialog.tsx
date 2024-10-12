import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";

interface ConfirmFormDialogProps {
  verifyInput: string,
  title: string,
  onConfirm: ()=> void,
  onCancel?: ()=> void,
}

const DeleteConfirmFormDialog = ({title, verifyInput, onConfirm, onCancel}:ConfirmFormDialogProps)=> {
  const [open, setOpen] = React.useState(false);
  const onDialogCancel = ()=> {
    onCancel?.()
    setOpen(false);
  }


  const validFormSchema = z.object({
    input: z.string().refine(v=> v===verifyInput, {message: "输入需与内容一致"})
  })
  const onSubmit = (v: z.infer<typeof validFormSchema>)=> {onConfirm()}
  const form = useForm<z.infer<typeof validFormSchema>>({
    resolver: zodResolver(validFormSchema),
    defaultValues: {
      input: ''
    }
  })
  return <Dialog open={open} onOpenChange={() => setOpen(s=>!s)}>
    <DialogTrigger asChild>
      <Button variant={'destructive'}>删除</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className={'text-md font-bold'}>
              <span>确认要删除吗？</span><br/>
              请输入 <span className={'px-1 py-0.5 rounded-lg bg-red-200'}>{verifyInput}</span> 进行确认
            </div>
            <FormField
              name={'input'}
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Input {...field}/>
                  </FormControl>
                </FormItem>
              )
              }>
            </FormField>
            <div className={'flex justify-end gap-2 pt-2'}>
              <Button type={'button'} onClick={onDialogCancel} variant={'outline'}>取消</Button>
              <Button type={'submit'} variant={'destructive'}>确认删除</Button>
            </div>
          </form>
        </Form>
    </DialogContent>
  </Dialog>
}

export default DeleteConfirmFormDialog;
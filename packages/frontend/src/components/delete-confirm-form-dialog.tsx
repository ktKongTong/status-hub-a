import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {useToggle} from "@/hooks/util/use-toggle";
import {LoadingButton} from "@/components/loading-button";

interface ConfirmFormDialogProps {

  title: string,
  onConfirm: () => Promise<void>,
  name: string,
  children?: React.ReactNode,
}

const DeleteConfirmFormDialog = ({title, name, children, onConfirm}:ConfirmFormDialogProps)=> {
  const [open, toggle] = useToggle()
  const [loading, setLoading] = useState(false)
  const validFormSchema = z.object({
    input: z.string().refine(v=> v === "DELETE" as string, {message: "输入需与内容一致"})
  })


  const form = useForm<z.infer<typeof validFormSchema>>({
    resolver: zodResolver(validFormSchema),
    defaultValues: {
      input: ''
    }
  })

  const onSubmit = (v: z.infer<typeof validFormSchema>)=> {
    setLoading(true)
    onConfirm().finally(() => {
      toggle()
      setLoading(false)
      form.reset()
    })
  }
  return <Dialog open={open} onOpenChange={toggle}>
    <DialogTrigger asChild>
      {
        children ?? <Button variant={'destructive'}>删除</Button>
      }
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle> {title} </DialogTitle>
      </DialogHeader>

      <DialogDescription>
          确认要删除 {name} 吗？
          <span className={'text-destructive'}>该操作不可撤销</span>
      </DialogDescription>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name={'input'}
              control={form.control}
              render={({field}) => (
                <FormItem >
                  <FormLabel>输入 <span className={'text-destructive-foreground px-2 py-0.5 rounded bg-destructive/70'}>DELETE</span> 进行确认</FormLabel>
                  <FormControl>
                    <Input {...field}/>
                  </FormControl>
                </FormItem>
              )
              }>
            </FormField>
            <div className={'flex justify-end gap-2 pt-2'}>
              <Button type={'button'} onClick={toggle} variant={'outline'}>取消</Button>
              <LoadingButton type={'submit'} variant={'destructive'} loading={loading}>确认删除</LoadingButton>
            </div>
          </form>
        </Form>
    </DialogContent>
  </Dialog>
}

export default DeleteConfirmFormDialog;
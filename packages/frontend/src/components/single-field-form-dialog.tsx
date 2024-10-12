import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {Input} from "@/components/ui/input";

import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";

interface SingleFieldFormDialogProps {
  title: string,
  description: string,
  name: string,
  onConfirm: (v: string)=> void,
  onCancel?: ()=> void,
  children: React.ReactNode,
}

const validFormSchema = z.object({
  input: z.string(),
})

const SingleFieldFormDialog = ({title,children, name, description, onConfirm, onCancel}:SingleFieldFormDialogProps)=> {
  const [open, setOpen] = React.useState(false);
  const onDialogCancel = ()=> {
    onCancel?.()
    setOpen(false);
  }

  const onSubmit = (v: z.infer<typeof validFormSchema>)=> {
    onConfirm(v.input)
    setOpen(false);
  }
  const form = useForm<z.infer<typeof validFormSchema>>({
    resolver: zodResolver(validFormSchema),
    defaultValues: {
      input: ''
    }
  })

  return <Dialog open={open} onOpenChange={() => setOpen(s=>!s)}>
    <DialogTrigger asChild>
      { children}
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name={'input'}
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>{name}</FormLabel>
                <FormControl>
                  <Input {...field}/>
                </FormControl>
                <FormDescription>{description}</FormDescription>
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
}

export default SingleFieldFormDialog;
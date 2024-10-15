import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { TokenCreateSchema } from "status-hub-shared/models/vo";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {convertShortStrToTime, convertTimeToShortStr} from "@/app/dashboard/token/sec-converter";
import {LoadingButton} from "@/components/loading-button";
import {useCreateToken} from "@/hooks/query/use-tokens";
import {
  AlertDialog, AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {Label} from "@/components/ui/label";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {ExclamationTriangleIcon} from "@radix-ui/react-icons";
import { CopyButton } from "@/components/copy-button";
import {EyeOff, Eye} from "lucide-react";
import {useToggle} from "@/hooks/util/use-toggle";

const validFormSchema = TokenCreateSchema

interface TokenCreateFormProps {
  // onConfirm: (v: z.infer<typeof validFormSchema>)=> void,
  onCancel?: ()=> void,
  children: React.ReactNode,
}

const TokenCreateForm = (props:TokenCreateFormProps)=> {
  const tokenCreator = useCreateToken()

  const [alertToken, setAlertToken] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen,setAlertOpen] = useState(false);
  const [loading, _, setLoading] = useToggle()
  const [keyVisible, toggleKeyVisible] = useToggle()

  const onDialogCancel = ()=> {setDialogOpen(false)}

  const onSubmit = (v: z.infer<typeof validFormSchema>)=> {
    setLoading(true);
    tokenCreator.mutateAsync(v)
      .then(res => {
        const token = res.token!
        setAlertToken(token);
        setAlertOpen(true)
      }).finally(() => {
        setDialogOpen(false);
        setLoading(false);
      })
  }
  const form = useForm<z.infer<typeof validFormSchema>>({
    resolver: zodResolver(validFormSchema),
    defaultValues: {
      identifier: '',
      expires: 30 * 24 * 3600
    }
  })
  return (
    <>
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>API Key</AlertDialogTitle>
        </AlertDialogHeader>

          <Alert variant='warning'>
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              你只能看到一次该 Token，请妥善保存。
            </AlertDescription>
          </Alert>
          <Label>APIKey</Label>
          <div className={'relative'}>
            <Input className={'cursor-default'} value={alertToken} readOnly id={'apiKey'} type={keyVisible?'text':'password'}/>
            <div
              className="absolute bottom-0 top-0 z-10 flex items-center gap-0.5 text-slate-11 data-[side=left]:left-2 data-[side=right]:right-1"
              data-side="right">
              <Button
                type="button" data-state="closed"
                className="h-6 w-6"
                variant={'ghost'}
                size={'icon'}
                onClick={toggleKeyVisible}
              >
                { keyVisible ? <Eye className={'h-4 w-4'}/> : <EyeOff className={'h-4 w-4'}/> }
              </Button>
              <CopyButton
                className="cursor-pointer"
                type='button'
                data-state="closed"
                text={alertToken}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Done</AlertDialogCancel>
          </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          {props.children}
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
                      <Select defaultValue={'30d'} value={convertTimeToShortStr(field.value)}
                              onValueChange={(v) => field.onChange(convertShortStrToTime(v))}>
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
                <LoadingButton loading={loading} type={'submit'}>创建</LoadingButton>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TokenCreateForm
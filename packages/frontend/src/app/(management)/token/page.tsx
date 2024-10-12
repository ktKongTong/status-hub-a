'use client'

import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {useCreateToken, useDeleteToken, useTokens} from "@/hooks/use-tokens";
import SingleFieldFormDialog from "@/components/single-field-form-dialog";
import TokenCreateForm from "@/app/(management)/token/token-create-form";
import {TokenCreateSchema} from "status-hub-shared/models";
import {z} from "zod";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import DeleteConfirmFormDialog from "@/components/delete-confirm-form-dialog";
import {ClipboardPaste, CopyIcon} from "lucide-react";

export default function Home() {
  const [curToken, setCurToken] = useState<string|null>(null)
  const tokenCreator = useCreateToken()
  const tokenDeleter = useDeleteToken()
  const createToken = (v: z.infer<typeof TokenCreateSchema>)=> {
    tokenCreator.mutateAsync(v)
      .then(res => {
        const token = res.token!
        setCurToken(token)
      })
  }
  const {data} = useTokens()
  const [copied, setCopied] = useState<boolean>(false)
  const onCopy = ()=> {
    setCopied(true)
    if(curToken) {
      navigator.clipboard.writeText(curToken)
    }
    setTimeout(()=> {setCopied(false)}, 2000)
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Token 管理</h1>
      <TokenCreateForm  onConfirm={createToken}>
        <Button className="mb-4">创建新Token</Button>
      </TokenCreateForm>
      {
        curToken !== null &&
        <div className={'bg-green-200 px-4 py-2 rounded-lg flex w-fit items-center gap-2'}>
            <div className={'text-sm '}>已创建，该Token 仅显示一次，请适当记忆</div>
          <p>{curToken}</p>
          <div> {!copied ?<CopyIcon onClick={onCopy} className={'cursor-pointer'} /> : <ClipboardPaste/>}</div>
        </div>
      }
      <ul>
        <Table>
          <TableHeader>
            <TableHead>名称</TableHead>
            <TableHead>有效期</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead>Ops</TableHead>
          </TableHeader>
          <TableBody>
            {
              data?.map(token => (
                <TableRow key={token.identifier} className="p-4">
                  <TableCell>{token.identifier}</TableCell>
                  <TableCell>{token.expires}</TableCell>
                  <TableCell>{token.createdAt.toString()}</TableCell>
                  <TableCell>
                  <DeleteConfirmFormDialog verifyInput={token.identifier} title={"删除Token"} onConfirm={()=>tokenDeleter.mutate(token.identifier)}/>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </ul>
    </div>
  )
}
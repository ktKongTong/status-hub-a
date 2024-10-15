'use client'

import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import { useDeleteToken, useTokens } from "@/hooks/use-tokens";
import TokenCreateForm from "@/app/dashboard/token/token-create-form";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import DeleteConfirmFormDialog from "@/components/delete-confirm-form-dialog";
import {convertTimeToShortStr} from "@/app/dashboard/token/sec-converter";

export default function Home() {
  const [curToken, setCurToken] = useState<string|null>(null)
  const tokenDeleter = useDeleteToken()

  const {data} = useTokens()

  return (
    <div className="">
      <div className={'flex items-center justify-between py-8'}>
        <h1 className="text-2xl font-bold">Tokens</h1>
        <TokenCreateForm>
          <Button>创建新Token</Button>
        </TokenCreateForm>
      </div>
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
                  <TableCell>{convertTimeToShortStr(token.expires)}</TableCell>
                  <TableCell>{token.createdAt.toString()}</TableCell>
                  <TableCell>
                    <DeleteConfirmFormDialog
                      name={`API Key ${token.identifier}`}
                      title={"删除Token"}
                      onConfirm={()=> tokenDeleter.mutateAsync(token.identifier)}
                    />
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
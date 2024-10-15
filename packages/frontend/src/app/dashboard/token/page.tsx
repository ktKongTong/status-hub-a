'use client'

import React from "react";
import {Button} from "@/components/ui/button";
import { useDeleteToken, useTokens } from "@/hooks/query/use-tokens";
import TokenCreateForm from "@/app/dashboard/token/token-create-form";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import { DeleteConfirmFormDialogContent } from "@/components/delete-confirm-form-dialog";
import {convertTimeToShortStr} from "@/app/dashboard/token/sec-converter";
import {formatRelativeTimeToNow} from "status-hub-shared/utils";
import {  TrashIcon } from "@radix-ui/react-icons";
import {DropdownMenuWithMultiDialog} from "@/components/dropdown-menu-with-dialog";

export default function Home() {
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
            <TableHead>Token</TableHead>
            <TableHead>有效期</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead></TableHead>
          </TableHeader>
          <TableBody>
            {
              data?.map(token => (
                <TableRow key={token.identifier} className="p-4">
                  <TableCell>{token.identifier}</TableCell>
                  <TableCell>
                    <span className={'inline-flex select-none items-center whitespace-nowrap font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200/70 text-xs h-6 px-2 rounded'}>
                      {token.shortToken}...
                    </span>
                  </TableCell>
                  <TableCell>{convertTimeToShortStr(token.expires)}</TableCell>
                  <TableCell>{formatRelativeTimeToNow(token.createdAt.toString())}</TableCell>
                  <TableCell>
                    <DropdownMenuWithMultiDialog
                      dialogs={{
                        'delete': {
                          trigger: <div className={'w-full inline-flex text-destructive items-center gap-2'}><TrashIcon/> Delete</div>,
                          content: (open, setOpen) =>
                            <DeleteConfirmFormDialogContent
                              open={open}
                              setOpen={setOpen}
                              name={`API Key ${token.identifier}`}
                              title={"删除Token"}
                              onConfirm={() => tokenDeleter.mutateAsync(token.identifier)}/>
                        }
                      }}
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
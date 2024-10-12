'use client'
import React, { useState } from 'react';
import { useCredentials, useDeleteCredential } from '@/hooks/use-credentials';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


import { Credential } from 'status-hub-shared/models'
import CredentialEditor from "@/app/(management)/credentials/editor";
import CredentialCreateForm from "@/app/(management)/credentials/credential-create-form";
import {useCredentialSchemas} from "@/hooks/use-credential-schemas";


export default function CredentialManagement() {
  const { data: credentials, isLoading, error } = useCredentials();
  const { schemas } = useCredentialSchemas();
  const deleteMutation = useDeleteCredential();


  const handleDeleteCredential = (id: number) => {
    deleteMutation.mutate(id);
  };
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);
  const [credentialDetailId, setCredentialDetailId] = useState<number | null>(null);
  if (isLoading) return <div className="p-4">加载中...</div>;
  if (error) return <div className="p-4 text-red-500">发生错误: {(error as Error).message}</div>;
  if (!credentials) return <div className="p-4">没有可用的凭证数据</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">凭证管理</h1>
      {schemas && <CredentialCreateForm schemas={schemas}/>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>平台</TableHead>
            <TableHead>凭证类型</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          {credentials.map((credential: Credential) => (

            <React.Fragment key={credential.id}>
              <TableRow>
                <TableCell>{credential.schema.platform}</TableCell>
                <TableCell>{credential.schema.credentialType}</TableCell>
                <TableCell>
                  <Button variant="outline" className="mr-2" onClick={() => {
                    if(credential.id === credentialDetailId) setCredentialDetailId(null)
                    else setCredentialDetailId(credential.id)
                  }}>查看</Button>
                  <Button variant="outline" className="mr-2" onClick={() => setEditingCredential(credential)}>编辑</Button>
                  <Button variant="destructive" onClick={() => handleDeleteCredential(credential.id)}>删除</Button>
                </TableCell>
              </TableRow>
              {
                credentialDetailId === credential.id && Object.entries(credential.credentialValues).map(([key, value]) => (
                  <TableRow className={'bg-zinc-200'} key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell colSpan={2}>
                      <div className={'flex items-center'}>
                        <div className={'line-clamp-1 text-xs m-2 overflow-hidden'}>{value}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              }
              {/*{*/}
              {/*  */}
              {/*}*/}
            </React.Fragment>
          ))

          }
        </TableBody>
      </Table>
      {
        editingCredential && <CredentialEditor editingCredential={editingCredential} setEditingCredential={setEditingCredential} />
      }

    </div>
  );
};

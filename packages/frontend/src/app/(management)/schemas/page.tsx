'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CredentialSchemaFormDialog from "@/app/(management)/schemas/credential-schema-form";
import TableSkeleton from "@/components/table-skelton";
import {useCredentialSchemas} from "@/hooks/use-credential-schemas";
import SchemaTableRow from "@/app/(management)/schemas/schema-table-row";

const CredentialSchemaManagement: React.FC = () => {

  const { schemas, isLoading, error } = useCredentialSchemas();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">凭证模式管理</h1>
      <CredentialSchemaFormDialog asChild>
        <Button className="mb-4">创建新模式</Button>
      </CredentialSchemaFormDialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">平台</TableHead>
            <TableHead className="w-[100px]">凭证类型</TableHead>
            <TableHead>可用</TableHead>
            <TableHead>描述</TableHead>
            <TableHead className="w-[100px]">Ops</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
             schemas.map((schema) => (<SchemaTableRow schema={schema} key={schema.id}/>))
          }
        </TableBody>
        {
          isLoading && <TableSkeleton row={3} column={4}/>
        }
      </Table>
    </div>
  );
};

export default CredentialSchemaManagement;

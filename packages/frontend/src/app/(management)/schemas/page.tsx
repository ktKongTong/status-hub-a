'use client'
import React, { useState } from 'react';
import { useCredentialSchemas, useCreateCredentialSchema, useUpdateCredentialSchema, useDeleteCredentialSchema } from './query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import FieldEditor from './field-editor';
import {CredentialSchemaSelect, CredentialSchemaUpdate, SchemaField} from "status-hub-shared/models";
const CredentialSchemaManagement: React.FC = () => {
  const { data: schemas, isLoading, error } = useCredentialSchemas();
  const createMutation = useCreateCredentialSchema();
  const updateMutation = useUpdateCredentialSchema();
  const deleteMutation = useDeleteCredentialSchema();

  const [newSchema, setNewSchema] = useState({
    platform: '',
    credentialType: '',
    available: true,
    permissions: '',
    availablePermissions: '',
    autoRefreshable: false,
    refreshLogicType: 'script' as const,
    schemaFields: [] as SchemaField[],
  });

  const [editingSchema, setEditingSchema] = useState<CredentialSchemaSelect | null>(null);
  const [editingBasicInfo, setEditingBasicInfo] = useState<{ id: string, field: string, value: any } | null>(null);

  const handleCreateSchema = () => {
    createMutation.mutate(newSchema);
  };

  const handleUpdateSchema = (schema: CredentialSchemaUpdate) => {
    updateMutation.mutate(schema);
    setEditingSchema(null);
  };

  const handleDeleteSchema = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleBasicInfoEdit = (id: string, field: string, value: any) => {
    setEditingBasicInfo({ id, field, value });
  };

  const handleSaveBasicInfo = () => {
    if (editingBasicInfo) {
      const { id, field, value } = editingBasicInfo;
      const updatedSchema = schemas?.find(schema => schema.id === id);
      if (updatedSchema) {
        updateMutation.mutate({ ...updatedSchema, [field]: value });
      }
      setEditingBasicInfo(null);
    }
  };

  if (isLoading) return <div className="p-4">加载中...</div>;
  if (error) return <div className="p-4 text-red-500">发生错误: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">凭证模式管理</h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">创建新模式</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>创建新凭证模式</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="platform" className="text-right">平台</Label>
              <Input id="platform" className="col-span-3" value={newSchema.platform}
                     onChange={(e) => setNewSchema({...newSchema, platform: e.target.value})}/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="credentialType" className="text-right">凭证类型</Label>
              <Input id="credentialType" className="col-span-3" value={newSchema.credentialType}
                     onChange={(e) => setNewSchema({...newSchema, credentialType: e.target.value})}/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="available" className="text-right">可用</Label>
              <Switch id="available" checked={newSchema.available}
                      onCheckedChange={(checked) => setNewSchema({...newSchema, available: checked})}/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="autoRefreshable" className="text-right">可自动刷新</Label>
              <Switch id="autoRefreshable" checked={newSchema.autoRefreshable}
                      onCheckedChange={(checked) => setNewSchema({...newSchema, autoRefreshable: checked})}/>
            </div>
          </div>
          <Button onClick={handleCreateSchema}>创建</Button>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>平台</TableHead>
            <TableHead>凭证类型</TableHead>
            <TableHead>可用</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schemas?.map((schema) => (
            <React.Fragment key={schema.id}>
              <TableRow>
                <TableCell>
                  {editingBasicInfo?.id === schema.id && editingBasicInfo?.field === 'platform' ? (
                    <Input 
                      value={editingBasicInfo.value} 
                      onChange={(e) => setEditingBasicInfo({...editingBasicInfo, value: e.target.value})}
                    />
                  ) : (
                    <span onClick={() => handleBasicInfoEdit(schema.id, 'platform', schema.platform)}>{schema.platform}</span>
                  )}
                </TableCell>
                <TableCell>
                  {editingBasicInfo?.id === schema.id && editingBasicInfo?.field === 'credentialType' ? (
                    <Input 
                      value={editingBasicInfo.value} 
                      onChange={(e) => setEditingBasicInfo({...editingBasicInfo, value: e.target.value})}
                    />
                  ) : (
                    <span onClick={() => handleBasicInfoEdit(schema.id, 'credentialType', schema.credentialType)}>{schema.credentialType}</span>
                  )}
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={schema.available} 
                    onCheckedChange={(checked) => handleBasicInfoEdit(schema.id, 'available', checked)}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="outline" className="mr-2" onClick={() => setEditingSchema(schema)}>编辑字段</Button>
                  <Button variant="destructive" onClick={() => handleDeleteSchema(schema.id)}>删除</Button>
                  {editingBasicInfo?.id === schema.id && (
                    <Button onClick={handleSaveBasicInfo}>保存</Button>
                  )}
                </TableCell>
              </TableRow>
              {editingSchema?.id === schema.id && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <FieldEditor 
                      schema={editingSchema}
                      onSave={handleUpdateSchema}
                      onCancel={() => setEditingSchema(null)}
                    />
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CredentialSchemaManagement;

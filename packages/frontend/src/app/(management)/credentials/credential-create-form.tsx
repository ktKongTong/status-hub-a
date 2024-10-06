import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import React, {useState} from "react";
import {useCreateCredential} from "@/app/(management)/credentials/query";
import {CredentialSchemaSelect} from "status-hub-shared/models";

export default function CredentialCreateForm(
{
  schemas
}:{
  schemas: CredentialSchemaSelect[]
}
) {
  const createMutation = useCreateCredential();
  const [newCredential, setNewCredential] = useState<{
    schemaId: string;
    schemaVersion: number;
    credentialValues: Record<string, string>;
  }>({
    schemaId: '',
    schemaVersion: 0,
    credentialValues: {}
  })

  const [open,setOpen] = useState(false);
  const handleCreateCredential = () => {
    createMutation.mutateAsync(newCredential).then(() => setOpen(false))
  };


  const handleSchemaSelect = (schemaId: string) => {
    const selectedSchema = schemas?.find(schema => schema.id === schemaId);
    if (selectedSchema) {
      setNewCredential({
        schemaId: selectedSchema.id,
        schemaVersion: selectedSchema.schemaVersion,
        credentialValues: {}
      });
    }
  };
  return (

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4" onClick={()=>{setOpen(true)}}>创建新凭证</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>创建新凭证</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="schema" className="text-right">选择凭证模式</Label>
            <Select onValueChange={handleSchemaSelect}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="选择凭证模式" />
              </SelectTrigger>
              <SelectContent>
                {schemas?.map(schema => (
                  <SelectItem key={schema.id} value={schema.id}>
                    {schema.platform} - {schema.credentialType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {newCredential.schemaId && schemas?.find(schema => schema.id === newCredential.schemaId)?.schemaFields.map(field => (
            <div key={field.fieldName} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.fieldName} className="text-right">{field.fieldName}</Label>
              <Input
                id={field.fieldName}
                className="col-span-3"
                value={newCredential.credentialValues[field.fieldName] || ''}
                onChange={(e) => setNewCredential({
                  ...newCredential,
                  credentialValues: {
                    ...newCredential.credentialValues,
                    [field.fieldName]: e.target.value
                  }
                })}
              />
            </div>
          ))}
        </div>
        <Button onClick={handleCreateCredential}>创建</Button>
      </DialogContent>
    </Dialog>
  )
}
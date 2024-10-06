
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import OauthPopup from "@/components/oauth-popup";
import {Button} from "@/components/ui/button";
import React from "react";
import {Credential, SchemaField} from "status-hub-shared/models";
import {useUpdateCredential} from "@/app/(management)/credentials/query";

export default function CredentialEditor(
{
  editingCredential,
  setEditingCredential
}:{
  editingCredential: Credential,
  setEditingCredential: (credential: Credential | null) => void
}

) {

  const updateMutation = useUpdateCredential();
  const handleUpdateCredential = (credential: Credential) => {
    updateMutation.mutate(credential);
    setEditingCredential(null);
  };

  const handleOauthAutoFill = (obj: Record<string, string>) => {
    // use obj to fill editing credentialValues by schemaFields
    const fileds = editingCredential?.schema.schemaFields
    if (fileds) {
      const credentialValues = editingCredential?.schema.schemaFields.map((field: { fieldName: string | number; }) => ({
        [field.fieldName]: obj[field.fieldName]
      }))

      // eslint-disable-next-line
      const res =  credentialValues.reduce((acc: Record<string, any>, cur: Record<string, any>) => {
        return {...acc, ...cur}
      }, {})
      setEditingCredential({
        ...editingCredential,
        credentialValues: res
      });
    }
  };
  return (
    <Dialog open={!!editingCredential} onOpenChange={() => setEditingCredential(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑凭证</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {editingCredential!.schema.schemaFields.map((field:SchemaField) => (
            <div key={field.fieldName} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.fieldName} className="text-right">{field.fieldName}</Label>
              <Input
                id={field.fieldName}
                className="col-span-3"
                value={editingCredential.credentialValues[field.fieldName] as string || ''}
                onChange={(e) => setEditingCredential({
                  ...editingCredential,
                  credentialValues: {
                    ...editingCredential.credentialValues,
                    [field.fieldName]: e.target.value
                  }
                })}
              />
            </div>
          ))}
        </div>
        <div>
          <OauthPopup
            title= {'OAuth Adapter'}
            url={`/api/route/oauth/adapter/${editingCredential.schema.platform}`}
            onCode = {(it)=> {
              const obj = JSON.parse(atob(it))
              handleOauthAutoFill(obj)
            }}
            onClose = {()=> {}}
            height={400}
            width={400}
          >
            <Button>OAuth Fill</Button>
          </OauthPopup>
        </div>
        <Button onClick={() => handleUpdateCredential(editingCredential)}>保存</Button>
      </DialogContent>
    </Dialog>
  )
}
import { CredentialSchemaSelect } from "status-hub-shared/models/vo";
import React, {useState} from "react";
import {TableCell, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {
  useDeleteCredentialSchema,
} from "@/hooks/query/use-credential-schemas";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {Check, X} from "lucide-react";
import DeleteConfirmFormDialog from "@/components/delete-confirm-form-dialog";
import EditableCredentialSchemaDetail from "@/app/dashboard/schemas/editable-credential-schema-detail";

const SchemaTableRow = ({schema}:{schema: CredentialSchemaSelect}) => {
  const isSystemSchema = schema.createdBy === 'system'
  const deleteMutation = useDeleteCredentialSchema();
  const [detailOpen, setDetailOpen] = useState(false);
  return (
    <TableRow>
      <TableCell>
        <span>{schema.platform}</span>
      </TableCell>
      <TableCell>
        <span>{schema.credentialType}</span>
      </TableCell>
      <TableCell>
        { schema.available && <Check className={'h-8 w-8 text-green-500'}/>}
        { !schema.available && <X className={'h-8 w-8 text-destructive'}/>}
      </TableCell>
      <TableCell>
        {schema.description}
      </TableCell>
      <TableCell colSpan={2} className={'flex items-center gap-2'}>
        <Dialog open={detailOpen} onOpenChange={() => setDetailOpen((state)=> !state)}>
          <DialogTrigger asChild>
            <Button>查看详情</Button>
          </DialogTrigger>
          <DialogContent>
            <EditableCredentialSchemaDetail schema={schema} afterSave={()=>setDetailOpen(false)} afterCancel={()=>setDetailOpen(false)}/>
          </DialogContent>
        </Dialog>
        {
          !isSystemSchema &&
            <DeleteConfirmFormDialog
              title={'删除 Schema'}
              onConfirm={() => deleteMutation.mutateAsync(schema.id)}
              name={`schema ${schema.id}`}
            />
        }
      </TableCell>
    </TableRow>

  )
}

export default React.memo(SchemaTableRow)
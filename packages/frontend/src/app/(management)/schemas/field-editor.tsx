import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  CredentialSchemaSelect,
  CredentialSchemaUpdate, SchemaField
} from "status-hub-shared/models";

interface FieldEditorProps {
  schema: CredentialSchemaSelect;
  onSave: (updatedSchema: CredentialSchemaUpdate) => void;
  onCancel: () => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ schema, onSave, onCancel }) => {
  const [fields, setFields] = useState<SchemaField[]>(schema.schemaFields);
  const [error, setError] = useState<string | null>(null);

  const handleFieldChange = (index: number, field: string, value: any) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setFields(updatedFields);
    setError(null);
  };

  const addField = () => {
    setFields([...fields, { fieldName: '', fieldType: 'string', isRequired: false, description: '' }]);
    setError(null);
  };

  const removeField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
    setError(null);
  };

  const handleSave = () => {
    const emptyFields = fields.filter(field => !field.fieldName.trim());
    if (emptyFields.length > 0) {
      setError('请填写所有字段名称');
      return;
    }
    console.log("update", { ...schema, schemaFields: fields })
    onSave({ ...schema, schemaFields: fields });
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            value={field.fieldName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(index, 'fieldName', e.target.value)}
            placeholder="字段名称"
          />
          <Select
            value={field.fieldType}
            onValueChange={(value: string) => handleFieldChange(index, 'fieldType', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">字符串</SelectItem>
              <SelectItem value="number">数字</SelectItem>
              <SelectItem value="boolean">布尔值</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Switch
              checked={field.isRequired}
              onCheckedChange={(checked: boolean) => handleFieldChange(index, 'isRequired', checked)}
            />
            <Label>必填</Label>
          </div>
          <Input
            value={field.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(index, 'description', e.target.value)}
            placeholder="描述"
          />
          <Button variant="destructive" onClick={() => removeField(index)}>删除</Button>
        </div>
      ))}
      <Button onClick={addField}>添加字段</Button>
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>取消</Button>
        <Button onClick={handleSave}>保存</Button>
      </div>
    </div>
  );
};

export default FieldEditor;

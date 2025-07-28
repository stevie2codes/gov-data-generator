import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { 
  Edit3, 
  Save, 
  X, 
  Download, 
  Plus, 
  Trash2,
  Eye,
  EyeOff 
} from 'lucide-react';
import { toast } from 'sonner';

interface DataEditorProps {
  data: any[];
  dataType: string;
  onSave: (editedData: any[]) => void;
  onDownload: (format: 'json' | 'csv') => void;
  onBack: () => void;
}

interface EditingState {
  [key: string]: boolean;
}

interface EditedValues {
  [recordId: string]: {
    [field: string]: any;
  };
}

interface ValidationErrors {
  [recordId: string]: {
    [field: string]: string;
  };
}

export function DataEditor({ data, dataType, onSave, onDownload, onBack }: DataEditorProps) {
  const [editedData, setEditedData] = useState<any[]>(data);
  const [editingState, setEditingState] = useState<EditingState>({});
  const [editedValues, setEditedValues] = useState<EditedValues>({});
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  if (!editedData.length) return null;

  const columns = Object.keys(editedData[0]);
  const visibleColumns = columns.filter(col => !hiddenColumns.has(col));

  const validateField = (field: string, value: any): string | null => {
    if (!value && field !== 'description') {
      return 'This field is required';
    }

    // Email validation
    if (field.toLowerCase().includes('email') && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Invalid email format';
      }
    }

    // Phone validation
    if (field.toLowerCase().includes('phone') && value) {
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        return 'Invalid phone format (use: 123-456-7890)';
      }
    }

    // Number validation
    if ((field.toLowerCase().includes('amount') || field.toLowerCase().includes('value') || field.toLowerCase().includes('salary')) && value) {
      if (isNaN(Number(value)) || Number(value) < 0) {
        return 'Must be a positive number';
      }
    }

    // Date validation
    if (field.toLowerCase().includes('date') && value) {
      if (isNaN(Date.parse(value))) {
        return 'Invalid date format';
      }
    }

    return null;
  };

  const startEdit = (recordId: string) => {
    setEditingState(prev => ({ ...prev, [recordId]: true }));
    setEditedValues(prev => ({
      ...prev,
      [recordId]: { ...editedData.find(item => item.id === recordId) }
    }));
  };

  const cancelEdit = (recordId: string) => {
    setEditingState(prev => ({ ...prev, [recordId]: false }));
    setEditedValues(prev => {
      const newValues = { ...prev };
      delete newValues[recordId];
      return newValues;
    });
  };

  const saveEdit = (recordId: string) => {
    const editedRecord = editedValues[recordId];
    if (editedRecord) {
      // Validate all fields
      const errors: { [field: string]: string } = {};
      Object.keys(editedRecord).forEach(field => {
        const error = validateField(field, editedRecord[field]);
        if (error) {
          errors[field] = error;
        }
      });

      if (Object.keys(errors).length > 0) {
        setValidationErrors(prev => ({ ...prev, [recordId]: errors }));
        toast.error('Please fix validation errors before saving');
        return;
      }

      // Clear validation errors for this record
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[recordId];
        return newErrors;
      });

      const newData = editedData.map(item => 
        item.id === recordId ? editedRecord : item
      );
      setEditedData(newData);
      setEditingState(prev => ({ ...prev, [recordId]: false }));
      setEditedValues(prev => {
        const newValues = { ...prev };
        delete newValues[recordId];
        return newValues;
      });
      toast.success('Record updated successfully');
    }
  };

  const updateField = (recordId: string, field: string, value: any) => {
    setEditedValues(prev => ({
      ...prev,
      [recordId]: {
        ...prev[recordId],
        [field]: value
      }
    }));

    // Clear validation error for this field if it exists
    if (validationErrors[recordId]?.[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [recordId]: {
          ...prev[recordId],
          [field]: ''
        }
      }));
    }
  };

  const deleteRecord = (recordId: string) => {
    const newData = editedData.filter(item => item.id !== recordId);
    setEditedData(newData);
    toast.success('Record deleted successfully');
  };

  const addNewRecord = () => {
    const newRecord: any = { id: Date.now().toString() };
    columns.forEach(col => {
      if (col !== 'id') {
        newRecord[col] = '';
      }
    });
    setEditedData(prev => [...prev, newRecord]);
    startEdit(newRecord.id);
    toast.success('New record added');
  };

  const toggleColumnVisibility = (column: string) => {
    setHiddenColumns(prev => {
      const newHidden = new Set(prev);
      if (newHidden.has(column)) {
        newHidden.delete(column);
      } else {
        newHidden.add(column);
      }
      return newHidden;
    });
  };

  const handleSaveAll = () => {
    onSave(editedData);
    toast.success(`Saved ${editedData.length} ${dataType} records`);
  };

  const getFieldValue = (record: any, field: string, recordId: string) => {
    if (editingState[recordId] && editedValues[recordId]) {
      return editedValues[recordId][field] ?? record[field];
    }
    return record[field];
  };

  const renderCellContent = (record: any, field: string) => {
    const recordId = record.id;
    const isEditing = editingState[recordId];
    const value = getFieldValue(record, field, recordId);
    const hasError = validationErrors[recordId]?.[field];

    if (isEditing) {
      return (
        <div className="space-y-1">
          <Input
            value={value || ''}
            onChange={(e) => updateField(recordId, field, e.target.value)}
            className={`min-w-[120px] h-8 ${hasError ? 'border-red-500' : ''}`}
          />
          {hasError && (
            <span className="text-xs text-red-500">{hasError}</span>
          )}
        </div>
      );
    }

    if (typeof value === 'boolean') {
      return (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? 'Yes' : 'No'}
        </Badge>
      );
    }

    if (typeof value === 'number') {
      return <span className="font-mono">{value.toLocaleString()}</span>;
    }

    return <span className="truncate max-w-[200px]" title={value}>{value}</span>;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Edit {dataType} Data ({editedData.length} records)
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button onClick={addNewRecord} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
            <Button onClick={handleSaveAll} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save All Changes
            </Button>
            <Button onClick={onBack} size="sm" variant="outline">
              Back to Preview
            </Button>
          </div>
        </div>
        
        {/* Column visibility controls */}
        <div className="flex flex-wrap gap-2 pt-4">
          <span className="text-sm font-medium">Show/Hide Columns:</span>
          {columns.map(column => (
            <Button
              key={column}
              onClick={() => toggleColumnVisibility(column)}
              size="sm"
              variant={hiddenColumns.has(column) ? "outline" : "secondary"}
              className="h-6 text-xs"
            >
              {hiddenColumns.has(column) ? (
                <EyeOff className="h-3 w-3 mr-1" />
              ) : (
                <Eye className="h-3 w-3 mr-1" />
              )}
              {column}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  {visibleColumns.map(column => (
                    <TableHead key={column} className="min-w-[120px]">
                      {column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </TableHead>
                  ))}
                  <TableHead className="w-[140px] sticky right-0 bg-background">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {editedData.map((record) => {
                  const recordId = record.id;
                  const isEditing = editingState[recordId];
                  
                  return (
                    <TableRow key={recordId} className={isEditing ? "bg-muted/50" : ""}>
                      {visibleColumns.map(column => (
                        <TableCell key={column} className="py-2">
                          {renderCellContent(record, column)}
                        </TableCell>
                      ))}
                      <TableCell className="py-2 sticky right-0 bg-background">
                        <div className="flex items-center gap-1">
                          {isEditing ? (
                            <>
                              <Button
                                onClick={() => saveEdit(recordId)}
                                size="sm"
                                variant="default"
                                className="h-8 w-8 p-0"
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                onClick={() => cancelEdit(recordId)}
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                onClick={() => startEdit(recordId)}
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              <Button
                                onClick={() => deleteRecord(recordId)}
                                size="sm"
                                variant="destructive"
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Download section */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="text-sm text-muted-foreground">
            Ready to export {editedData.length} records
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => onDownload('json')} 
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download JSON
            </Button>
            <Button 
              onClick={() => onDownload('csv')} 
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
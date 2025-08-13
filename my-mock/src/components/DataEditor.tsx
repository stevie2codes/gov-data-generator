import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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
  Trash2,
  Eye,
  EyeOff,
  Settings,
  RotateCcw,
  CheckCircle,
  Type,
  Hash,
  Calendar,
  Mail,
  Phone,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';

interface DataEditorProps {
  data: any[];
  dataType: string;
  onSave: (editedData: any[]) => void;
  onDownload: (format: 'json' | 'csv') => void;
  onBack: () => void;
}

interface ColumnOperation {
  column: string;
  operation: 'replace' | 'transform' | 'convert' | 'validate';
  value?: string;
  transform?: string;
  targetType?: string;
  preview?: any[];
}

interface ColumnMetadata {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'phone';
  sampleValues: any[];
  uniqueCount: number;
  hasNulls: boolean;
}

interface ColumnEditModal {
  isOpen: boolean;
  column: string | null;
  operation: 'replace' | 'transform' | 'convert' | null;
  value: string;
  transform: string;
  targetType: string;
}

export function DataEditor({ data, dataType, onSave, onDownload, onBack }: DataEditorProps) {
  const [editedData, setEditedData] = useState<any[]>(data);
  const [columnOperations, setColumnOperations] = useState<ColumnOperation[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [showColumnEditor, setShowColumnEditor] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [columnModal, setColumnModal] = useState<ColumnEditModal>({
    isOpen: false,
    column: null,
    operation: null,
    value: '',
    transform: '',
    targetType: ''
  });

  if (!editedData.length) return null;

  const columns = Object.keys(editedData[0]);
  const visibleColumns = columns.filter(col => !hiddenColumns.has(col));

  // Analyze column metadata for better editing
  const columnMetadata = useMemo(() => {
    return columns.map(col => {
      const values = editedData.map(row => row[col]);
      const uniqueValues = new Set(values);
      
      // Determine column type
      let type: ColumnMetadata['type'] = 'string';
      if (values.every(v => typeof v === 'number' || v === null)) type = 'number';
      else if (values.every(v => typeof v === 'boolean' || v === null)) type = 'boolean';
      else if (values.some(v => v && typeof v === 'string' && v.match(/^\d{4}-\d{2}-\d{2}/))) type = 'date';
      else if (values.some(v => v && typeof v === 'string' && v.includes('@'))) type = 'email';
      else if (values.some(v => v && typeof v === 'string' && v.match(/[\d\-\(\)\s]{10,}/))) type = 'phone';

      return {
        name: col,
        type,
        sampleValues: values.slice(0, 5),
        uniqueCount: uniqueValues.size,
        hasNulls: values.some(v => v === null || v === undefined)
      };
    });
  }, [editedData, columns]);

  // Column operations
  const applyColumnOperation = (operation: ColumnOperation) => {
    const { column, operation: op, value, transform, targetType } = operation;
    
    const newData = editedData.map(row => {
      const newRow = { ...row };
      
      switch (op) {
        case 'replace':
          if (value) {
            newRow[column] = value;
          }
          break;
          
        case 'transform':
          if (transform) {
            const currentValue = row[column];
            if (currentValue) {
              try {
                // Simple transformations
                if (transform === 'uppercase') newRow[column] = String(currentValue).toUpperCase();
                else if (transform === 'lowercase') newRow[column] = String(currentValue).toLowerCase();
                else if (transform === 'capitalize') {
                  newRow[column] = String(currentValue).replace(/\b\w/g, l => l.toUpperCase());
                }
                else if (transform === 'trim') newRow[column] = String(currentValue).trim();
                else if (transform.startsWith('replace:')) {
                  const [oldVal, newVal] = transform.substring(8).split('→');
                  newRow[column] = String(currentValue).replace(new RegExp(oldVal, 'g'), newVal);
                }
              } catch (e) {
                console.error('Transform error:', e);
              }
            }
          }
          break;
          
        case 'convert':
          if (targetType) {
            const currentValue = row[column];
            try {
              switch (targetType) {
                case 'number':
                  newRow[column] = currentValue ? Number(currentValue) : null;
                  break;
                case 'string':
                  newRow[column] = currentValue ? String(currentValue) : '';
                  break;
                case 'boolean':
                  newRow[column] = Boolean(currentValue);
                  break;
                case 'date':
                  newRow[column] = currentValue ? new Date(currentValue).toISOString().split('T')[0] : null;
                  break;
              }
            } catch (e) {
              console.error('Conversion error:', e);
            }
          }
          break;
      }
      
      return newRow;
    });
    
    setEditedData(newData);
    setColumnOperations(prev => [...prev, operation]);
    toast.success(`Applied ${op} operation to ${column} column`);
  };

  const getColumnIcon = (type: string) => {
    switch (type) {
      case 'number': return <Hash className="h-4 w-4" />;
      case 'date': return <Calendar className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'boolean': return <CheckCircle className="h-4 w-4" />;
      default: return <Type className="h-4 w-4" />;
    }
  };

  const openColumnModal = (column: string) => {
    const columnMeta = columnMetadata.find(c => c.name === column);
    setColumnModal({
      isOpen: true,
      column,
      operation: null,
      value: '',
      transform: '',
      targetType: columnMeta?.type || 'string'
    });
  };

  const closeColumnModal = () => {
    setColumnModal({
      isOpen: false,
      column: null,
      operation: null,
      value: '',
      transform: '',
      targetType: ''
    });
  };

  const applyColumnModalChanges = () => {
    if (!columnModal.column || !columnModal.operation) return;

    const operation: ColumnOperation = {
      column: columnModal.column,
      operation: columnModal.operation,
      value: columnModal.value,
      transform: columnModal.transform,
      targetType: columnModal.targetType
    };

    applyColumnOperation(operation);
    closeColumnModal();
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

  const resetColumn = (column: string) => {
    const originalData = data.find(row => row.id === editedData[0].id);
    if (originalData) {
      const newData = editedData.map(row => ({
        ...row,
        [column]: originalData[column]
      }));
      setEditedData(newData);
      toast.success(`Reset ${column} column to original values`);
    }
  };



  const deleteRecord = (recordId: string) => {
    setEditedData(editedData.filter(row => row.id !== recordId));
    toast.success('Deleted record');
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
            <Button 
              onClick={() => setShowColumnEditor(!showColumnEditor)} 
              size="sm" 
              variant={showColumnEditor ? "default" : "outline"}
            >
              <Settings className="h-4 w-4 mr-2" />
              Column Editor
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
        
        {/* Column Editor Panel */}
        {showColumnEditor && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Column Operations</h4>
              <Button 
                onClick={() => setPreviewMode(!previewMode)} 
                size="sm" 
                variant={previewMode ? "default" : "outline"}
              >
                {previewMode ? "Hide Preview" : "Show Preview"}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {columnMetadata.map((col) => (
                <div key={col.name} className="p-3 border rounded-lg bg-background">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getColumnIcon(col.type)}
                      <span className="font-medium text-sm">{col.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {col.type}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => resetColumn(col.name)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground mb-3">
                    <div>Unique: {col.uniqueCount}</div>
                    <div>Sample: {col.sampleValues.slice(0, 3).join(', ')}</div>
                    {col.hasNulls && <div className="text-orange-600">Contains nulls</div>}
                  </div>
                  
                  {/* Quick Operations */}
                  <div className="space-y-2">
                    <Select onValueChange={(value) => {
                      if (value === 'uppercase' || value === 'lowercase' || value === 'capitalize') {
                        applyColumnOperation({
                          column: col.name,
                          operation: 'transform',
                          transform: value
                        });
                      }
                    }}>
                      <SelectTrigger size="sm">
                        <SelectValue placeholder="Quick actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="uppercase">To Uppercase</SelectItem>
                        <SelectItem value="lowercase">To Lowercase</SelectItem>
                        <SelectItem value="capitalize">Capitalize</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input
                      placeholder="Replace all with..."
                      size={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          applyColumnOperation({
                            column: col.name,
                            operation: 'replace',
                            value: e.currentTarget.value
                          });
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
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
        {/* Data Table - Read-only with column operations */}
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Actions</TableHead>
                                 {visibleColumns.map((column) => (
                   <TableHead 
                     key={column} 
                     className="cursor-pointer hover:bg-muted/50 transition-colors"
                     onClick={() => openColumnModal(column)}
                   >
                     <div className="flex items-center gap-2 group">
                       {getColumnIcon(columnMetadata.find(c => c.name === column)?.type || 'string')}
                       <span>{column.replace(/([A-Z])/g, ' $1').trim()}</span>
                       <Badge variant="outline" className="text-xs">
                         {columnMetadata.find(c => c.name === column)?.type || 'string'}
                       </Badge>
                       <ChevronDown className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                   </TableHead>
                 ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {editedData.map((row, index) => (
                <TableRow key={row.id || index} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => deleteRecord(row.id)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  {visibleColumns.map((column) => (
                    <TableCell key={column} className="max-w-48">
                      <div className="truncate" title={String(row[column] || '')}>
                        {typeof row[column] === 'boolean' ? (
                          <Badge variant={row[column] ? "default" : "secondary"}>
                            {row[column] ? 'Yes' : 'No'}
                          </Badge>
                        ) : typeof row[column] === 'number' ? (
                          <span className="font-mono">{row[column]?.toLocaleString() || '-'}</span>
                        ) : (
                          row[column]?.toString() || '-'
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Applied Operations History */}
        {columnOperations.length > 0 && (
          <div className="mt-6 p-4 bg-muted/20 rounded-lg">
            <h4 className="font-medium mb-3">Applied Operations</h4>
            <div className="space-y-2">
              {columnOperations.map((op, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">{op.operation}</span>
                  <span>on</span>
                  <Badge variant="outline">{op.column}</Badge>
                  {op.value && <span>→ {op.value}</span>}
                  {op.transform && <span>→ {op.transform}</span>}
                  {op.targetType && <span>→ {op.targetType}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Column Edit Modal */}
      {columnModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Edit Column: {columnModal.column}
              </h3>
              <Button
                onClick={closeColumnModal}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Column Info */}
            {columnModal.column && (
              <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getColumnIcon(columnMetadata.find(c => c.name === columnModal.column!)?.type || 'string')}
                  <span className="font-medium">{columnModal.column}</span>
                  <Badge variant="outline">
                    {columnMetadata.find(c => c.name === columnModal.column!)?.type || 'string'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>Records: {editedData.length}</div>
                  <div>Unique values: {columnMetadata.find(c => c.name === columnModal.column!)?.uniqueCount}</div>
                </div>
              </div>
            )}

            {/* Operation Selection */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Operation Type</Label>
                <Select
                  value={columnModal.operation || ''}
                  onValueChange={(value: 'replace' | 'transform' | 'convert') => 
                    setColumnModal(prev => ({ ...prev, operation: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select operation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="replace">Replace All Values</SelectItem>
                    <SelectItem value="transform">Transform Values</SelectItem>
                    <SelectItem value="convert">Convert Data Type</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Replace Operation */}
              {columnModal.operation === 'replace' && (
                <div>
                  <Label className="text-sm font-medium">New Value</Label>
                  <Input
                    placeholder="Enter new value for all records"
                    value={columnModal.value}
                    onChange={(e) => setColumnModal(prev => ({ ...prev, value: e.target.value }))}
                  />
                </div>
              )}

              {/* Transform Operation */}
              {columnModal.operation === 'transform' && (
                <div>
                  <Label className="text-sm font-medium">Transformation</Label>
                  <Select
                    value={columnModal.transform}
                    onValueChange={(value) => setColumnModal(prev => ({ ...prev, transform: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transformation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uppercase">To Uppercase</SelectItem>
                      <SelectItem value="lowercase">To Lowercase</SelectItem>
                      <SelectItem value="capitalize">Capitalize Words</SelectItem>
                      <SelectItem value="trim">Trim Whitespace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Convert Operation */}
              {columnModal.operation === 'convert' && (
                <div>
                  <Label className="text-sm font-medium">Target Data Type</Label>
                  <Select
                    value={columnModal.targetType}
                    onValueChange={(value) => setColumnModal(prev => ({ ...prev, targetType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={closeColumnModal}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={applyColumnModalChanges}
                  disabled={!columnModal.operation || 
                    (columnModal.operation === 'replace' && !columnModal.value) ||
                    (columnModal.operation === 'transform' && !columnModal.transform) ||
                    (columnModal.operation === 'convert' && !columnModal.targetType)
                  }
                  className="flex-1"
                >
                  Apply Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
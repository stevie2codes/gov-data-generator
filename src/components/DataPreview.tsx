import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  FileJson, 
  FileSpreadsheet, 
  Search, 
  Eye, 
  EyeOff,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Settings,
  CheckCircle,
  Type,
  Hash,
  Calendar,
  Mail,
  Phone,
  X,
  Columns3,
  Download
} from 'lucide-react';
import { convertToCSV } from './DataGenerator';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface DataPreviewProps {
  data: any[];
  dataType: string;
  onDownload: (_format: 'json' | 'csv') => void;
  onDataChange: (newData: any[]) => void;
}

type SortDirection = 'asc' | 'desc' | null;

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

export function DataPreview({ data, dataType, onDownload, onDataChange }: DataPreviewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());

  const [columnModal, setColumnModal] = useState<ColumnEditModal>({
    isOpen: false,
    column: null,
    operation: null,
    value: '',
    transform: '',
    targetType: ''
  });
  const [columnDropdownOpen, setColumnDropdownOpen] = useState(false);
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);

  if (data.length === 0) return null;

  const headers = Object.keys(data[0]);

  // Filter and search data
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row =>
      Object.values(row).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Toggle column visibility
  const toggleColumn = (column: string) => {
    const newHidden = new Set(hiddenColumns);
    if (newHidden.has(column)) {
      newHidden.delete(column);
    } else {
      newHidden.add(column);
    }
    setHiddenColumns(newHidden);
  };

  // Format cell value
  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'string' && value.length > 50) {
      return value.substring(0, 50) + '...';
    }
    return value.toString();
  };

  // Download functionality
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownload = (_format: 'json' | 'csv') => {
    const timestamp = new Date().toISOString().split('T')[0];

    if (_format === 'json') {
      const content = JSON.stringify(data, null, 2);
      downloadFile(content, `${dataType}-${timestamp}.json`, 'application/json');
    } else {
      const content = convertToCSV(data);
      downloadFile(content, `${dataType}-${timestamp}.csv`, 'text/csv');
    }

    onDownload(_format);
  };

  // Analyze column metadata for better editing
  const columnMetadata = useMemo(() => {
    return headers.map(col => {
      const values = data.map(row => row[col]);
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
  }, [data, headers]);

  // Column operations
  const applyColumnOperation = (operation: ColumnOperation) => {
    const { column, operation: op, value, transform, targetType } = operation;
    
    const newData = data.map(row => {
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
    
    onDataChange(newData);
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

  const visibleHeaders = headers.filter(header => !hiddenColumns.has(header));

  return (
    <Card className="w-full terminal-card rounded-sm border-primary/15">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <CardTitle className="text-sm tracking-[0.2em] text-muted-foreground uppercase font-semibold">
              Dataset Output
            </CardTitle>
            <Badge variant="secondary" className="text-xs h-5 px-2 rounded-sm bg-primary/15 text-primary border-primary/25 font-data font-medium">
              {data.length} rec
            </Badge>
            {filteredData.length !== data.length && (
              <Badge variant="outline" className="text-xs h-5 px-2 rounded-sm border-accent/30 text-accent font-data font-medium">
                {filteredData.length} filtered
              </Badge>
            )}
          </div>
          {/* Download Button with Dropdown */}
          <div className="relative">
            <Button
              onClick={() => setDownloadDropdownOpen(!downloadDropdownOpen)}
              variant="outline"
              size="sm"
              className="h-8 text-sm rounded-sm border-primary/20 hover:border-primary/40 hover:bg-primary/5"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Export
              <ChevronDown className="h-3.5 w-3.5 ml-1" />
            </Button>
            
            {downloadDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-popover border border-primary/20 rounded-sm shadow-lg shadow-black/40 z-50">
                <div className="p-1.5 space-y-0.5">
                  <Button
                    onClick={() => {
                      handleDownload('json');
                      setDownloadDropdownOpen(false);
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-8 text-sm rounded-sm hover:bg-primary/10"
                  >
                    <FileJson className="h-4 w-4 mr-2 text-primary/70" />
                    Export as JSON
                  </Button>
                  <Button
                    onClick={() => {
                      handleDownload('csv');
                      setDownloadDropdownOpen(false);
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-8 text-sm rounded-sm hover:bg-primary/10"
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2 text-primary/70" />
                    Export as CSV
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search all fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-8 text-sm rounded-sm bg-secondary border-primary/15 focus:border-primary/40 text-foreground"
            />
          </div>

          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-28 h-8 text-sm rounded-sm border-primary/15 bg-secondary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-sm">
              <SelectItem value="5" className="text-sm">5 rows</SelectItem>
              <SelectItem value="10" className="text-sm">10 rows</SelectItem>
              <SelectItem value="25" className="text-sm">25 rows</SelectItem>
              <SelectItem value="50" className="text-sm">50 rows</SelectItem>
            </SelectContent>
          </Select>

          {/* Column Visibility Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setColumnDropdownOpen(!columnDropdownOpen)}
              className="h-8 text-sm rounded-sm border-primary/15 hover:border-primary/35 hover:bg-primary/5"
            >
              <Columns3 className="h-4 w-4 mr-1.5" />
              Cols ({visibleHeaders.length}/{headers.length})
            </Button>

            {columnDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-popover border border-primary/20 rounded-sm shadow-lg shadow-black/40 z-50 max-h-80 overflow-y-auto">
                <div className="px-3 py-2 border-b border-primary/15 flex items-center justify-between">
                  <span className="text-sm tracking-[0.15em] text-muted-foreground uppercase font-semibold">Columns</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setColumnDropdownOpen(false)}
                    className="h-5 w-5 p-0 hover:bg-primary/10"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <div className="p-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setHiddenColumns(new Set())}
                    className="w-full justify-start h-6 text-xs rounded-sm hover:bg-primary/10 mb-1"
                  >
                    <Eye className="h-3 w-3 mr-2 text-primary/70" />
                    Show All
                  </Button>
                  <div className="border-t border-primary/10 my-1" />
                  {headers.map((header) => (
                    <Button
                      key={header}
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleColumn(header)}
                      className="w-full justify-start h-6 text-xs rounded-sm hover:bg-primary/10"
                    >
                      {hiddenColumns.has(header) ? (
                        <EyeOff className="h-3 w-3 mr-2 text-muted-foreground/40" />
                      ) : (
                        <Eye className="h-3 w-3 mr-2 text-primary/60" />
                      )}
                      <span className={hiddenColumns.has(header) ? 'text-muted-foreground/40' : ''}>
                        {header.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>

        {/* Data Table */}
        <div className="overflow-x-auto border border-primary/12 rounded-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-primary/15 bg-muted/20 hover:bg-muted/20">
                {visibleHeaders.map((header) => (
                  <TableHead
                    key={header}
                    className="group relative py-2.5 text-xs tracking-[0.1em] text-muted-foreground uppercase font-semibold"
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <div
                        className="flex items-center gap-1 flex-1 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleSort(header)}
                      >
                        {header.replace(/([A-Z])/g, ' $1').trim()}
                        {sortColumn === header && (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-3 w-3 text-primary" />
                          ) : (
                            <ChevronDown className="h-3 w-3 text-primary" />
                          )
                        )}
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          openColumnModal(header);
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 opacity-0 group-hover:opacity-60 hover:opacity-100 hover:bg-primary/10 hover:text-primary transition-all rounded-sm"
                        title="Edit column"
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow
                  key={index}
                  className={`border-b border-primary/[0.06] hover:bg-primary/[0.04] transition-colors ${
                    index % 2 === 0 ? 'bg-transparent' : 'bg-muted/[0.08]'
                  }`}
                >
                  {visibleHeaders.map((header) => (
                    <TableCell key={header} className="max-w-48 py-2 text-sm text-foreground/85">
                      <div className="truncate font-data" title={formatCellValue(row[header])}>
                        {formatCellValue(row[header])}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-muted-foreground/80 font-data">
              {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, sortedData.length)} / {sortedData.length}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-6 w-6 p-0 rounded-sm border-primary/20 hover:border-primary/40 hover:bg-primary/5"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>

              <div className="flex items-center gap-0.5">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 p-0 text-sm rounded-sm font-data ${
                        currentPage === pageNum
                          ? 'bg-primary/20 text-primary border-primary/40'
                          : 'border-primary/15 hover:border-primary/35 hover:bg-primary/5'
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-6 w-6 p-0 rounded-sm border-primary/20 hover:border-primary/40 hover:bg-primary/5"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* No results message */}
        {filteredData.length === 0 && searchTerm && (
          <div className="text-center py-8 text-sm text-muted-foreground/70 font-data tracking-widest">
            // NO RESULTS FOR "{searchTerm}"
          </div>
        )}
      </CardContent>

      {/* Column Edit Modal */}
      {columnModal.isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-card border border-primary/25 rounded-sm p-5 w-full max-w-md mx-4 terminal-card shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-1 font-semibold">Edit Column</div>
                <h3 className="text-base font-semibold text-foreground font-data">
                  {columnModal.column}
                </h3>
              </div>
              <Button
                onClick={closeColumnModal}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-sm hover:bg-primary/10"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Column Info */}
            {columnModal.column && (
              <div className="mb-4 p-2.5 bg-muted/20 rounded-sm border border-primary/10">
                <div className="flex items-center gap-2 mb-1.5">
                  {getColumnIcon(columnMetadata.find(c => c.name === columnModal.column!)?.type || 'string')}
                  <Badge variant="outline" className="text-xs h-5 px-2 rounded-sm border-primary/30 text-primary/90 font-data font-medium">
                    {columnMetadata.find(c => c.name === columnModal.column!)?.type || 'string'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground/80 font-data space-y-0.5">
                  <div>{data.length} records · {columnMetadata.find(c => c.name === columnModal.column!)?.uniqueCount} unique values</div>
                </div>
              </div>
            )}

            {/* Operation Selection */}
            <div className="space-y-3.5">
              <div>
                <Label className="text-xs tracking-[0.15em] text-muted-foreground uppercase mb-1.5 block font-semibold">Operation</Label>
                <Select
                  value={columnModal.operation || ''}
                  onValueChange={(value: 'replace' | 'transform' | 'convert') =>
                    setColumnModal(prev => ({ ...prev, operation: value }))
                  }
                >
                  <SelectTrigger className="h-9 text-sm rounded-sm border-primary/20 bg-secondary">
                    <SelectValue placeholder="Select operation" />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm">
                    <SelectItem value="replace" className="text-sm">Replace All Values</SelectItem>
                    <SelectItem value="transform" className="text-sm">Transform Values</SelectItem>
                    <SelectItem value="convert" className="text-sm">Convert Data Type</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Replace Operation */}
              {columnModal.operation === 'replace' && (
                <div>
                  <Label className="text-xs tracking-[0.15em] text-muted-foreground uppercase mb-1.5 block font-semibold">New Value</Label>
                  <Input
                    placeholder="Enter new value for all records"
                    value={columnModal.value}
                    onChange={(e) => setColumnModal(prev => ({ ...prev, value: e.target.value }))}
                    className="h-9 text-sm rounded-sm border-primary/20 bg-secondary focus:border-primary/50 text-foreground"
                  />
                </div>
              )}

              {/* Transform Operation */}
              {columnModal.operation === 'transform' && (
                <div>
                  <Label className="text-xs tracking-[0.15em] text-muted-foreground uppercase mb-1.5 block font-semibold">Transformation</Label>
                  <Select
                    value={columnModal.transform}
                    onValueChange={(value) => setColumnModal(prev => ({ ...prev, transform: value }))}
                  >
                    <SelectTrigger className="h-9 text-sm rounded-sm border-primary/20 bg-secondary">
                      <SelectValue placeholder="Select transformation" />
                    </SelectTrigger>
                    <SelectContent className="rounded-sm">
                      <SelectItem value="uppercase" className="text-sm">To Uppercase</SelectItem>
                      <SelectItem value="lowercase" className="text-sm">To Lowercase</SelectItem>
                      <SelectItem value="capitalize" className="text-sm">Capitalize Words</SelectItem>
                      <SelectItem value="trim" className="text-sm">Trim Whitespace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Convert Operation */}
              {columnModal.operation === 'convert' && (
                <div>
                  <Label className="text-xs tracking-[0.15em] text-muted-foreground uppercase mb-1.5 block font-semibold">Target Type</Label>
                  <Select
                    value={columnModal.targetType}
                    onValueChange={(value) => setColumnModal(prev => ({ ...prev, targetType: value }))}
                  >
                    <SelectTrigger className="h-9 text-sm rounded-sm border-primary/20 bg-secondary">
                      <SelectValue placeholder="Select target type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-sm">
                      <SelectItem value="string" className="text-sm">String</SelectItem>
                      <SelectItem value="number" className="text-sm">Number</SelectItem>
                      <SelectItem value="boolean" className="text-sm">Boolean</SelectItem>
                      <SelectItem value="date" className="text-sm">Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <Button
                  onClick={closeColumnModal}
                  variant="outline"
                  className="flex-1 h-9 text-sm rounded-sm border-primary/20 hover:border-primary/40"
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
                  className="flex-1 h-9 text-sm rounded-sm btn-amber"
                  style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
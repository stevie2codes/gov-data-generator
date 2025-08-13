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
  BarChart3,
  ChevronRight as ChevronRightIcon,
  TrendingUp,
  TrendingDown,
  Settings,
  CheckCircle,
  Type,
  Hash,
  Calendar,
  Mail,
  Phone,
  X
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
  const [expandedStats, setExpandedStats] = useState<Set<string>>(new Set());
  const [showAllStats, setShowAllStats] = useState(false);

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

  // Toggle stat expansion
  const toggleStat = (column: string) => {
    const newExpanded = new Set(expandedStats);
    if (newExpanded.has(column)) {
      newExpanded.delete(column);
    } else {
      newExpanded.add(column);
    }
    setExpandedStats(newExpanded);
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

  // Data statistics with progressive disclosure
  const stats = useMemo(() => {
    const numericColumns = headers.filter(header => 
      data.some(row => typeof row[header] === 'number')
    );
    
    return numericColumns.map(column => {
      const values = data.map(row => row[column]).filter(v => typeof v === 'number');
      if (values.length === 0) return null;
      
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      
      // Calculate percentiles for more detailed stats
      const sortedValues = [...values].sort((a, b) => a - b);
      const median = sortedValues[Math.floor(sortedValues.length / 2)];
      const q1 = sortedValues[Math.floor(sortedValues.length * 0.25)];
      const q3 = sortedValues[Math.floor(sortedValues.length * 0.75)];
      
      // Calculate variance and standard deviation
      const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);
      
      // Find most common values (mode)
      const frequency: { [key: number]: number } = {};
      values.forEach(val => {
        frequency[val] = (frequency[val] || 0) + 1;
      });
      const mode = Object.entries(frequency).reduce((a, b) => a[1] > b[1] ? a : b)[0];
      
      return { 
        column, 
        sum, 
        avg, 
        min, 
        max, 
        count: values.length,
        median,
        q1,
        q3,
        variance,
        stdDev,
        mode: Number(mode),
        range: max - min,
        coefficientOfVariation: (stdDev / avg) * 100
      };
    }).filter(Boolean);
  }, [data, headers]);

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

  // Show only first 3 stats by default, rest are hidden
  const visibleStats = showAllStats ? stats : stats.slice(0, 3);
  const hasHiddenStats = stats.length > 3;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CardTitle>Data Preview</CardTitle>
            <Badge variant="secondary">{data.length} records</Badge>
            {filteredData.length !== data.length && (
              <Badge variant="outline">{filteredData.length} filtered</Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleDownload('json')} variant="outline" size="sm">
              <FileJson className="h-4 w-4 mr-2" />
              JSON
            </Button>
            <Button onClick={() => handleDownload('csv')} variant="outline" size="sm">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search in all fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 rows</SelectItem>
              <SelectItem value="10">10 rows</SelectItem>
              <SelectItem value="25">25 rows</SelectItem>
              <SelectItem value="50">50 rows</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setHiddenColumns(new Set())}
          >
            <Eye className="h-4 w-4 mr-2" />
            Show All
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Statistics with Progressive Disclosure */}
        {stats.length > 0 && (
          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <h4 className="font-medium">Data Statistics</h4>
                <Badge variant="outline">{stats.length} numeric columns</Badge>
              </div>
              {hasHiddenStats && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllStats(!showAllStats)}
                >
                  {showAllStats ? 'Show Less' : `Show ${stats.length - 3} More`}
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleStats.map((stat) => (
                <div key={stat!.column} className="border rounded-lg p-3 bg-background">
                  {/* Basic Stats - Always Visible */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">
                      {stat!.column.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStat(stat!.column)}
                      className="h-6 w-6 p-0"
                    >
                      {expandedStats.has(stat!.column) ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRightIcon className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span>Avg: {stat!.avg.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="h-3 w-3 text-red-600" />
                      <span>Range: {stat!.range.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Expandable Detailed Stats */}
                  {expandedStats.has(stat!.column) && (
                    <div className="border-t pt-2 mt-2 space-y-2">
                      <div className="text-xs text-muted-foreground">
                        <div className="grid grid-cols-2 gap-1">
                          <span>Count: {stat!.count}</span>
                          <span>Sum: {stat!.sum.toLocaleString()}</span>
                          <span>Min: {stat!.min}</span>
                          <span>Max: {stat!.max}</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        <div className="font-medium mb-1">Distribution:</div>
                        <div className="grid grid-cols-2 gap-1">
                          <span>Median: {stat!.median.toFixed(2)}</span>
                          <span>Mode: {stat!.mode}</span>
                          <span>Q1: {stat!.q1.toFixed(2)}</span>
                          <span>Q3: {stat!.q3.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        <div className="font-medium mb-1">Variability:</div>
                        <div className="grid grid-cols-2 gap-1">
                          <span>Std Dev: {stat!.stdDev.toFixed(2)}</span>
                          <span>CV: {stat!.coefficientOfVariation.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            

          </div>
        )}

        {/* Column Visibility Toggle */}
        <div className="mb-4 p-3 bg-muted/20 rounded-lg">
          <div className="text-sm font-medium mb-2">Toggle Columns:</div>
          <div className="flex flex-wrap gap-2">
            {headers.map((header) => (
              <Button
                key={header}
                variant={hiddenColumns.has(header) ? "outline" : "default"}
                size="sm"
                onClick={() => toggleColumn(header)}
                className="text-xs"
              >
                {hiddenColumns.has(header) ? (
                  <EyeOff className="h-3 w-3 mr-1" />
                ) : (
                  <Eye className="h-3 w-3 mr-1" />
                )}
                {header.replace(/([A-Z])/g, ' $1').trim()}
              </Button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleHeaders.map((header) => (
                  <TableHead 
                    key={header} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center gap-1 flex-1"
                        onClick={() => handleSort(header)}
                      >
                        {header.replace(/([A-Z])/g, ' $1').trim()}
                        {sortColumn === header && (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
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
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
                <TableRow key={index} className="hover:bg-muted/30">
                  {visibleHeaders.map((header) => (
                    <TableCell key={header} className="max-w-48">
                      <div className="truncate" title={formatCellValue(row[header])}>
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
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1">
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
                      className="w-8 h-8 p-0"
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
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* No results message */}
        {filteredData.length === 0 && searchTerm && (
          <div className="text-center py-8 text-muted-foreground">
            No results found for "{searchTerm}". Try adjusting your search terms.
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
                  <div>Records: {data.length}</div>
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
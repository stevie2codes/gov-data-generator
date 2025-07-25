import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileJson, FileSpreadsheet } from 'lucide-react';
import { convertToCSV } from './DataGenerator';

interface DataPreviewProps {
  data: any[];
  dataType: string;
  onDownload: (format: 'json' | 'csv') => void;
}

export function DataPreview({ data, dataType, onDownload }: DataPreviewProps) {
  if (data.length === 0) return null;

  const headers = Object.keys(data[0]);
  const displayData = data.slice(0, 5); // Show first 5 rows

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

  const handleDownload = (format: 'json' | 'csv') => {
    const timestamp = new Date().toISOString().split('T')[0];

    if (format === 'json') {
      const content = JSON.stringify(data, null, 2);
      downloadFile(content, `${dataType}-${timestamp}.json`, 'application/json');
    } else {
      const content = convertToCSV(data);
      downloadFile(content, `${dataType}-${timestamp}.csv`, 'text/csv');
    }

    onDownload(format);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Data Preview</CardTitle>
            <Badge variant="secondary">{data.length} records</Badge>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handleDownload('json')}
              variant="outline"
              size="sm"
            >
              <FileJson className="h-4 w-4 mr-2" />
              JSON
            </Button>
            <Button
              onClick={() => handleDownload('csv')}
              variant="outline"
              size="sm"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                {headers.map((header) => (
                  <th key={header} className="text-left p-2 font-medium text-sm">
                    {header.replace(/([A-Z])/g, ' $1').trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayData.map((row, index) => (
                <tr key={index} className="border-b border-border/30">
                  {headers.map((header) => (
                    <td key={header} className="p-2 text-sm">
                      {typeof row[header] === 'boolean'
                        ? (row[header] ? 'Yes' : 'No')
                        : row[header]?.toString() || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > 5 && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              Showing 5 of {data.length} records. Download to see all data.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
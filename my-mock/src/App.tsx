import { useState } from 'react';
import { ConfigPanel } from './components/ConfigPanel';
import { DataPreview } from './components/DataPreview';
import { generateMockData } from './components/DataGenerator';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { Building2, Sparkles, FileText, ShoppingCart, Package } from 'lucide-react';

export default function App() {
  const [generatedData, setGeneratedData] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDataType, setCurrentDataType] = useState('');

  const handleGenerate = async (type: string, count: number, fields: string[]) => {
    setIsGenerating(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    try {
      const data = generateMockData(type, count, fields);
      setGeneratedData(data);
      setCurrentDataType(type);
      toast.success(`Generated ${count} ${type} records successfully!`);
    } catch (error) {
      toast.error('Failed to generate data. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = async (type: string, count: number, fields: string[]) => {
    const previewCount = Math.min(count, 5);
    setIsGenerating(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const data = generateMockData(type, previewCount, fields);
      setGeneratedData(data);
      setCurrentDataType(type);
      toast.success(`Preview generated for ${type}!`);
    } catch (error) {
      toast.error('Failed to generate preview. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (format: 'json' | 'csv') => {
    toast.success(`Downloaded ${generatedData.length} records as ${format.toUpperCase()}!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl">Government Data Generator</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Generate comprehensive mock data for government applications, civic tech projects, and municipal ERP systems.
            Create test datasets for citizens, employees, permits, licenses, procurement, inventory, and financial operations.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <ConfigPanel
              onGenerate={handleGenerate}
              onPreview={handlePreview}
              isGenerating={isGenerating}
            />
          </div>

          {/* Data Preview */}
          <div className="lg:col-span-2">
            {isGenerating ? (
              <div className="flex items-center justify-center h-64 bg-card rounded-lg border">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <div>
                    <h3 className="mb-2">Generating Data...</h3>
                    <p className="text-sm text-muted-foreground">
                      Creating realistic government data for testing purposes
                    </p>
                  </div>
                </div>
              </div>
            ) : generatedData.length > 0 ? (
              <DataPreview
                data={generatedData}
                dataType={currentDataType}
                onDownload={handleDownload}
              />
            ) : (
              <div className="flex items-center justify-center h-64 bg-card rounded-lg border border-dashed">
                <div className="text-center space-y-2">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg text-muted-foreground">No Data Generated Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure your government data type and click "Preview" or "Generate" to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
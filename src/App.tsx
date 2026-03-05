import { useState } from 'react';
import { ConfigPanel } from './components/ConfigPanel';
import { DataPreview } from './components/DataPreview';
import { generateMockData } from './components/DataGenerator';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { Building2, Sparkles, PanelLeftClose, PanelLeftOpen, BookOpen } from 'lucide-react';
import { ApiInfoPanel } from './components/ApiInfoPanel';
import { Button } from './components/ui/button';

export default function App() {
  const [generatedData, setGeneratedData] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDataType, setCurrentDataType] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleGenerate = async (type: string, count: number, fields: string[]) => {
    setIsGenerating(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    try {
      const data = generateMockData(type, count, fields);
      setGeneratedData(data);
      setCurrentDataType(type);
      toast.success(`Generated ${count} ${type} records successfully!`);
    } catch {
      toast.error('Failed to generate data. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (format: 'json' | 'csv') => {
    toast.success(`Downloaded ${generatedData.length} records as ${format.toUpperCase()}!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">

        {/* Classification Banner */}
        <div className="text-center py-1.5 mb-6 border-y border-primary/20">
          <span className="text-xs tracking-[0.25em] text-primary/60 uppercase font-data select-none">
            UNCLASSIFIED &nbsp;·&nbsp; SIMULATION ENVIRONMENT &nbsp;·&nbsp; NOT FOR OPERATIONAL USE
          </span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-8 animate-fade-slide-in">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-primary/80" />
              <span className="text-xs tracking-[0.3em] text-muted-foreground/80 uppercase font-medium">
                Federal Systems / Mock Data Terminal
              </span>
            </div>
            <h1 className="text-foreground mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', letterSpacing: '0.05em', lineHeight: 1 }}>
              Government Data Generator
            </h1>
            <p className="text-muted-foreground text-sm tracking-wide">
              Generate comprehensive mock records for testing government applications
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5 mt-1 text-right">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-green-400/90 tracking-widest font-medium">ONLINE</span>
            </div>
            <span className="text-xs text-muted-foreground/70 tracking-widest font-data">v2.4.1 · 14 SCHEMAS</span>
            <ApiInfoPanel>
              <Button variant="outline" size="sm" className="h-7 px-2.5 gap-1.5 text-xs tracking-wider uppercase font-semibold border-primary/25 text-muted-foreground hover:text-foreground">
                <BookOpen className="h-3 w-3" />
                API
              </Button>
            </ApiInfoPanel>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent mb-6" />

        {/* Main Content — Sidebar Layout */}
        <div className="flex gap-5 max-w-full mx-auto">

          {/* Sidebar Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed top-[6.5rem] left-4 z-50 p-1.5 bg-card border border-primary/20 hover:border-primary/50 hover:bg-muted transition-all duration-150 rounded-sm shadow-lg"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            title={sidebarOpen ? 'Collapse panel' : 'Expand panel'}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <PanelLeftOpen className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>

          {/* Configuration Panel — Collapsible Sidebar */}
          <div className={`transition-all duration-300 ease-in-out ${
            sidebarOpen
              ? 'w-72 flex-shrink-0'
              : 'w-0 overflow-hidden'
          }`}>
            <div className="sticky top-6">
              <ConfigPanel
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {isGenerating ? (
              <div className="flex items-center justify-center h-72 bg-card border border-primary/20 rounded-sm terminal-card">
                <div className="text-center space-y-5">
                  {/* Spinner + icon */}
                  <div className="relative flex items-center justify-center mx-auto w-14 h-14">
                    <div className="absolute inset-0 rounded-full border border-primary/15 animate-spin border-t-primary/70" style={{ animationDuration: '1.2s' }}></div>
                    <div className="absolute inset-2 rounded-full border border-primary/10 animate-spin border-b-primary/40" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
                    <Sparkles className="h-5 w-5 text-accent" />
                  </div>

                  <div>
                    <div className="text-sm tracking-[0.3em] text-primary animate-pulse mb-1 font-semibold">
                      SYNTHESIZING DATASET
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Generating realistic government records...
                    </div>
                  </div>

                  {/* Animated bars */}
                  <div className="flex justify-center items-end gap-0.5 h-5">
                    {[0, 1, 2, 3, 4, 5, 6].map(i => (
                      <div
                        key={i}
                        className="w-1 bg-primary/60 rounded-full animate-data-pulse"
                        style={{ animationDelay: `${i * 0.12}s`, height: `${60 + Math.sin(i) * 40}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : generatedData.length > 0 ? (
              <div className="animate-fade-slide-in">
                <DataPreview
                  data={generatedData}
                  dataType={currentDataType}
                  onDownload={handleDownload}
                  onDataChange={setGeneratedData}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-72 bg-card border border-dashed border-primary/15 rounded-sm">
                <div className="text-center space-y-4">
                  {/* Icon frame */}
                  <div className="relative mx-auto w-16 h-16 flex items-center justify-center corner-notch">
                    <div className="absolute inset-0 border border-primary/10"></div>
                    <div className="absolute inset-3 border border-primary/[0.07]"></div>
                    <Building2 className="h-7 w-7 text-muted-foreground/60" />
                  </div>
                  <div>
                    <div className="text-sm tracking-[0.3em] text-muted-foreground/70 mb-1.5 font-data">
                      // AWAITING INPUT
                    </div>
                    <div className="text-sm text-muted-foreground/60">
                      Configure a dataset schema and click Generate
                    </div>
                  </div>
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

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "./ui/select";
import { Zap } from "lucide-react";
import { dataTypeConfigs } from "@/generators/dataTypes";

interface ConfigPanelProps {
  onGenerate: (
    _type: string,
    _count: number,
    _fields: string[],
  ) => void;
  isGenerating: boolean;
}

const categoryEmojis: Record<string, string> = {
  "People & Citizens": "\u{1F465}",
  "Operations & Services": "\u{1F3E2}",
  "Financial & Accounting": "\u{1F4B0}",
  "Compliance & Licensing": "\u{1F4CB}",
  "Assets & Inventory": "\u{1F3D7}\uFE0F",
};

// Group data types by category with emoji prefixes for display
const groupedDataTypes = Object.entries(dataTypeConfigs).reduce((acc, [key, config]) => {
  const emoji = categoryEmojis[config.category] ?? "";
  const displayCategory = `${emoji} ${config.category}`;
  if (!acc[displayCategory]) {
    acc[displayCategory] = [];
  }
  acc[displayCategory].push({ key, ...config });
  return acc;
}, {} as Record<string, Array<{ key: string; name: string; description: string; fields: string[] }>>);

export function ConfigPanel({
  onGenerate,
  isGenerating,
}: ConfigPanelProps) {
  const [selectedType, setSelectedType] = useState<string>("citizens");
  const [recordCount, setRecordCount] = useState<number>(10);
  const [selectedFields, setSelectedFields] = useState<string[]>(dataTypeConfigs.citizens.fields);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSelectedFields(dataTypeConfigs[type as keyof typeof dataTypeConfigs].fields);
  };

  const handleFieldToggle = (field: string, checked: boolean) => {
    if (checked) {
      setSelectedFields([...selectedFields, field]);
    } else {
      setSelectedFields(selectedFields.filter((f) => f !== field));
    }
  };

  const currentConfig = dataTypeConfigs[selectedType as keyof typeof dataTypeConfigs];
  const allSelected = selectedFields.length === currentConfig.fields.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedFields([]);
    } else {
      setSelectedFields(currentConfig.fields);
    }
  };

  return (
    <div className="terminal-card rounded-sm overflow-hidden">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-primary/15 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs tracking-[0.25em] text-muted-foreground uppercase">Configure</span>
        </div>
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-primary/20 border border-primary/30"></span>
          <span className="w-2 h-2 rounded-full bg-accent/20 border border-accent/30"></span>
        </div>
      </div>

      <div className="p-4 space-y-5">

        {/* Data Type Selection */}
        <div className="space-y-2">
          <Label className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Schema Type
          </Label>
          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-full bg-muted/30 border-primary/20 hover:border-primary/40 transition-colors rounded-sm h-9">
              <span className={`text-sm ${currentConfig ? "text-foreground/90 font-medium" : "text-muted-foreground/50"}`}>
                {currentConfig?.name || "Select a data type"}
              </span>
            </SelectTrigger>
            <SelectContent className="rounded-sm min-w-[260px]">
              {Object.entries(groupedDataTypes).map(([category, types]) => (
                <div key={category}>
                  <div className="px-3 py-2 text-[10px] tracking-[0.2em] text-muted-foreground/60 bg-muted/50 border-b border-primary/10 uppercase font-semibold">
                    {category}
                  </div>
                  {types.map((type) => (
                    <SelectItem key={type.key} value={type.key} className="py-2.5 cursor-pointer">
                      <div className="flex flex-col items-start gap-0.5">
                        <span className="text-sm font-medium leading-tight">{type.name}</span>
                        <span className="text-xs text-muted-foreground/65 leading-snug">{type.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>

          {/* Schema description */}
          {currentConfig && (
            <p className="text-xs text-muted-foreground/50 leading-relaxed px-0.5">
              {currentConfig.description}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-primary/10" />

        {/* Record Count */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Records
            </Label>
            <span className="text-xs text-accent font-mono">{recordCount}</span>
          </div>
          <Input
            id="record-count"
            type="number"
            min="1"
            max="1000"
            value={recordCount}
            onChange={(e) =>
              setRecordCount(parseInt(e.target.value) || 1)
            }
            className="bg-muted/30 border-primary/20 focus:border-primary/60 rounded-sm h-8 text-xs"
          />
          <div className="flex gap-1.5">
            {[10, 25, 50, 100].map(n => (
              <button
                key={n}
                onClick={() => setRecordCount(n)}
                className={`flex-1 text-xs py-0.5 rounded-sm border transition-colors ${
                  recordCount === n
                    ? 'border-primary/50 bg-primary/10 text-primary'
                    : 'border-primary/15 text-muted-foreground/50 hover:border-primary/30 hover:text-muted-foreground'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={() =>
            onGenerate(selectedType, recordCount, selectedFields)
          }
          disabled={isGenerating || selectedFields.length === 0}
          className="w-full btn-amber h-9 rounded-sm text-xs tracking-[0.2em] uppercase font-semibold"
          style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border border-accent-foreground/40 border-t-accent-foreground/80 animate-spin inline-block"></span>
              Generating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5" />
              Generate Dataset
            </span>
          )}
        </Button>

        {/* Divider */}
        <div className="h-px bg-primary/10" />

        {/* Fields Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Fields
            </Label>
            <button
              onClick={toggleSelectAll}
              className="text-xs text-primary/60 hover:text-primary transition-colors tracking-wide"
            >
              {allSelected ? 'Deselect all' : 'Select all'}
            </button>
          </div>

          <div className="space-y-0 max-h-52 overflow-y-auto rounded-sm border border-primary/10 bg-muted/10">
            {currentConfig.fields.map((field, idx) => (
              <div
                key={field}
                className={`flex items-center gap-2.5 px-3 py-1.5 hover:bg-primary/5 transition-colors cursor-pointer ${
                  idx < currentConfig.fields.length - 1 ? 'border-b border-primary/[0.07]' : ''
                }`}
                onClick={() => handleFieldToggle(field, !selectedFields.includes(field))}
              >
                <Checkbox
                  id={field}
                  checked={selectedFields.includes(field)}
                  onCheckedChange={(checked) =>
                    handleFieldToggle(field, checked as boolean)
                  }
                  className="h-3 w-3 rounded-sm border-primary/30"
                />
                <span className={`text-xs capitalize select-none ${
                  selectedFields.includes(field) ? 'text-foreground/80' : 'text-muted-foreground/50'
                }`}>
                  {field.replace(/([A-Z])/g, " $1").trim()}
                </span>
              </div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground/40 text-right">
            {selectedFields.length} / {currentConfig.fields.length} selected
          </div>
        </div>
      </div>
    </div>
  );
}

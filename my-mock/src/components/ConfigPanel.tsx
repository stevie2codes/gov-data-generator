import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Building2, Download, ChevronDown, ChevronRight } from "lucide-react";

interface ConfigPanelProps {
  onGenerate: (
    _type: string,
    _count: number,
    _fields: string[],
  ) => void;
  isGenerating: boolean;
}

// Simple data type configurations with basic categorization
const dataTypeConfigs = {
  citizens: {
    name: "Citizens",
    category: "👥 People & Citizens",
    description: "Resident information and voter registration",
    fields: ["id", "firstName", "lastName", "ssn", "dateOfBirth", "address", "city", "state", "zipCode", "phone", "voterRegistered"],
  },
  employees: {
    name: "Government Employees",
    category: "👥 People & Citizens",
    description: "Staff records and employment information",
    fields: ["id", "employeeId", "firstName", "lastName", "department", "position", "hireDate", "salary", "email", "phone", "clearanceLevel"],
  },
  services: {
    name: "Public Services",
    category: "🏢 Operations & Services",
    description: "Municipal services and programs",
    fields: ["id", "serviceName", "department", "description", "isActive", "budget", "contactPhone", "website", "hoursOfOperation"],
  },
  contracts: {
    name: "Government Contracts",
    category: "🏢 Operations & Services",
    description: "Vendor contracts and agreements",
    fields: ["id", "contractNumber", "vendor", "contractType", "value", "startDate", "endDate", "status", "department", "description"],
  },
  workOrders: {
    name: "Work Orders",
    category: "🏢 Operations & Services",
    description: "Maintenance and service requests",
    fields: ["id", "workOrderNumber", "workOrderType", "description", "location", "requestDate", "scheduledDate", "assignedTo", "priority", "status", "estimatedCost", "completionDate"],
  },
  balanceSheet: {
    name: "Balance Sheet",
    category: "💰 Financial & Accounting",
    description: "Assets, liabilities, and equity positions",
    fields: ["id", "accountNumber", "accountName", "category", "currentPeriod", "priorPeriod", "change", "changePercent", "fiscalYear", "fund", "department", "notes"],
  },
  incomeStatement: {
    name: "Income Statement",
    category: "💰 Financial & Accounting",
    description: "Revenue, expenses, and budget variance analysis",
    fields: ["id", "accountNumber", "accountName", "category", "budgetedAmount", "actualAmount", "variance", "variancePercent", "fiscalYear", "period", "fund", "department", "notes"],
  },
  budget: {
    name: "Budget Records",
    category: "💰 Financial & Accounting",
    description: "Budget planning and spending tracking",
    fields: ["id", "fiscalYear", "department", "category", "budgetedAmount", "spentAmount", "remainingAmount", "percentSpent", "lastUpdated", "status"],
  },
  purchaseOrders: {
    name: "Purchase Orders",
    category: "💰 Financial & Accounting",
    description: "Procurement and purchasing records",
    fields: ["id", "poNumber", "vendor", "department", "description", "orderDate", "requestedBy", "totalAmount", "status", "deliveryDate", "approvedBy"],
  },
  invoices: {
    name: "Invoices & Payments",
    category: "💰 Financial & Accounting",
    description: "Billing and payment processing",
    fields: ["id", "invoiceNumber", "vendor", "poNumber", "invoiceDate", "dueDate", "amount", "status", "department", "description", "paymentDate"],
  },
  permits: {
    name: "Permits & Applications",
    category: "📋 Compliance & Licensing",
    description: "Building and development permits",
    fields: ["id", "permitNumber", "permitType", "applicantName", "propertyAddress", "applicationDate", "issueDate", "expirationDate", "status", "feeAmount", "inspector", "description"],
  },
  licenses: {
    name: "Business Licenses",
    category: "📋 Compliance & Licensing",
    description: "Business licensing and registration",
    fields: ["id", "licenseNumber", "licenseType", "businessName", "ownerName", "businessAddress", "applicationDate", "issueDate", "renewalDate", "status", "annualFee", "phone"],
  },
  municipalAssets: {
    name: "Municipal Assets",
    category: "🏗️ Assets & Inventory",
    description: "Government-owned property and equipment",
    fields: ["id", "assetTag", "assetType", "description", "department", "purchaseDate", "purchaseValue", "currentValue", "condition", "location", "serialNumber"],
  },
  inventory: {
    name: "Inventory Management",
    category: "🏗️ Assets & Inventory",
    description: "Supplies and consumable inventory",
    fields: ["id", "itemCode", "itemName", "category", "description", "quantity", "unitPrice", "totalValue", "location", "reorderLevel", "supplier", "lastUpdated"],
  },
};

// Group data types by category
const groupedDataTypes = Object.entries(dataTypeConfigs).reduce((acc, [key, config]) => {
  const category = config.category;
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push({ key, ...config });
  return acc;
}, {} as Record<string, Array<{ key: string; name: string; description: string; fields: string[] }>>);

export function ConfigPanel({
  onGenerate,
  isGenerating,
}: ConfigPanelProps) {
  const [selectedType, setSelectedType] = useState<string>("citizens");
  const [recordCount, setRecordCount] = useState<number>(10);
  const [selectedFields, setSelectedFields] = useState<string[]>(dataTypeConfigs.citizens.fields);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

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

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const currentConfig = dataTypeConfigs[selectedType as keyof typeof dataTypeConfigs];

  return (
    <Card className="w-full h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5 text-primary" />
          Data Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Data Type Selection with Categories */}
        <div className="space-y-3">
          <Label>Data Type</Label>
          <div className="space-y-2">
            {Object.entries(groupedDataTypes).map(([category, types]) => (
              <div key={category} className="border rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className="flex items-center justify-between w-full p-3 text-left font-medium hover:bg-muted/50 rounded-t-lg transition-colors"
                >
                  <span>{category}</span>
                  {expandedCategories.has(category) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                {expandedCategories.has(category) && (
                  <div className="p-3 pt-0 border-t bg-muted/20">
                    {types.map((type) => (
                      <div
                        key={type.key}
                        className={`p-2 rounded cursor-pointer transition-colors ${
                          selectedType === type.key
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => handleTypeChange(type.key)}
                      >
                        <div className="font-medium">{type.name}</div>
                        <div className="text-sm opacity-80">{type.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button - Positioned Above Sections */}
        <div className="pt-2">
          <Button
            onClick={() =>
              onGenerate(
                selectedType,
                recordCount,
                selectedFields,
              )
            }
            disabled={
              isGenerating || selectedFields.length === 0
            }
            className="w-full"
            size="lg"
          >
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating..." : "Generate Data"}
          </Button>
        </div>

        {/* Record Count */}
        <div className="space-y-2">
          <Label htmlFor="record-count">
            Number of Records
          </Label>
          <Input
            id="record-count"
            type="number"
            min="1"
            max="1000"
            value={recordCount}
            onChange={(e) =>
              setRecordCount(parseInt(e.target.value) || 1)
            }
            className="border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Fields Section */}
        <div className="space-y-3">
          <Label>Fields to Include</Label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-3 border rounded-lg bg-muted/20">
            {currentConfig.fields.map((field) => (
              <div
                key={field}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={field}
                  checked={selectedFields.includes(field)}
                  onCheckedChange={(checked) =>
                    handleFieldToggle(field, checked as boolean)
                  }
                />
                <Label
                  htmlFor={field}
                  className="text-sm capitalize cursor-pointer"
                >
                  {field.replace(/([A-Z])/g, " $1").trim()}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

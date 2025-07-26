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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Building2, Download, Eye } from "lucide-react";

interface ConfigPanelProps {
  onGenerate: (
    type: string,
    count: number,
    fields: string[],
  ) => void;
  onPreview: (
    type: string,
    count: number,
    fields: string[],
  ) => void;
  isGenerating: boolean;
}

const dataTypeConfigs = {
  citizens: {
    name: "Citizens",
    fields: [
      "id",
      "firstName",
      "lastName",
      "ssn",
      "dateOfBirth",
      "address",
      "city",
      "state",
      "zipCode",
      "phone",
      "voterRegistered",
    ],
  },
  employees: {
    name: "Government Employees",
    fields: [
      "id",
      "employeeId",
      "firstName",
      "lastName",
      "department",
      "position",
      "hireDate",
      "salary",
      "email",
      "phone",
      "clearanceLevel",
    ],
  },
  services: {
    name: "Public Services",
    fields: [
      "id",
      "serviceName",
      "department",
      "description",
      "isActive",
      "budget",
      "contactPhone",
      "website",
      "hoursOfOperation",
    ],
  },
  contracts: {
    name: "Government Contracts",
    fields: [
      "id",
      "contractNumber",
      "vendor",
      "contractType",
      "value",
      "startDate",
      "endDate",
      "status",
      "department",
      "description",
    ],
  },
  assets: {
    name: "Municipal Assets",
    fields: [
      "id",
      "assetTag",
      "assetType",
      "description",
      "department",
      "purchaseDate",
      "purchaseValue",
      "currentValue",
      "condition",
      "location",
      "serialNumber",
    ],
  },
  budget: {
    name: "Budget Records",
    fields: [
      "id",
      "fiscalYear",
      "department",
      "category",
      "budgetedAmount",
      "spentAmount",
      "remainingAmount",
      "percentSpent",
      "lastUpdated",
      "status",
    ],
  },
  permits: {
    name: "Permits & Applications",
    fields: [
      "id",
      "permitNumber",
      "permitType",
      "applicantName",
      "propertyAddress",
      "applicationDate",
      "issueDate",
      "expirationDate",
      "status",
      "feeAmount",
      "inspector",
      "description",
    ],
  },
  licenses: {
    name: "Business Licenses",
    fields: [
      "id",
      "licenseNumber",
      "licenseType",
      "businessName",
      "ownerName",
      "businessAddress",
      "applicationDate",
      "issueDate",
      "renewalDate",
      "status",
      "annualFee",
      "phone",
    ],
  },
  purchaseOrders: {
    name: "Purchase Orders",
    fields: [
      "id",
      "poNumber",
      "vendor",
      "department",
      "description",
      "orderDate",
      "requestedBy",
      "totalAmount",
      "status",
      "deliveryDate",
      "approvedBy",
    ],
  },
  invoices: {
    name: "Invoices & Payments",
    fields: [
      "id",
      "invoiceNumber",
      "vendor",
      "poNumber",
      "invoiceDate",
      "dueDate",
      "amount",
      "status",
      "department",
      "description",
      "paymentDate",
    ],
  },
  inventory: {
    name: "Inventory Management",
    fields: [
      "id",
      "itemCode",
      "itemName",
      "category",
      "description",
      "quantity",
      "unitPrice",
      "totalValue",
      "location",
      "reorderLevel",
      "supplier",
      "lastUpdated",
    ],
  },
  workOrders: {
    name: "Work Orders",
    fields: [
      "id",
      "workOrderNumber",
      "workOrderType",
      "description",
      "location",
      "requestDate",
      "scheduledDate",
      "assignedTo",
      "priority",
      "status",
      "estimatedCost",
      "completionDate",
    ],
  },
};

export function ConfigPanel({
  onGenerate,
  onPreview,
  isGenerating,
}: ConfigPanelProps) {
  const [selectedType, setSelectedType] =
    useState<string>("citizens");
  const [recordCount, setRecordCount] = useState<number>(10);
  const [selectedFields, setSelectedFields] = useState<
    string[]
  >(dataTypeConfigs.citizens.fields);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSelectedFields(
      dataTypeConfigs[type as keyof typeof dataTypeConfigs]
        .fields,
    );
  };

  const handleFieldToggle = (
    field: string,
    checked: boolean,
  ) => {
    if (checked) {
      setSelectedFields([...selectedFields, field]);
    } else {
      setSelectedFields(
        selectedFields.filter((f) => f !== field),
      );
    }
  };

  const currentConfig =
    dataTypeConfigs[
    selectedType as keyof typeof dataTypeConfigs
    ];

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Government Data Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="data-type">Data Type</Label>
          <Select
            value={selectedType}
            onValueChange={handleTypeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select data type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="citizens">Citizens</SelectItem>
              <SelectItem value="employees">
                Government Employees
              </SelectItem>
              <SelectItem value="services">
                Public Services
              </SelectItem>
              <SelectItem value="contracts">
                Government Contracts
              </SelectItem>
              <SelectItem value="assets">
                Municipal Assets
              </SelectItem>
              <SelectItem value="budget">
                Budget Records
              </SelectItem>
              <SelectItem value="permits">
                Permits & Applications
              </SelectItem>
              <SelectItem value="licenses">
                Business Licenses
              </SelectItem>
              <SelectItem value="purchaseOrders">
                Purchase Orders
              </SelectItem>
              <SelectItem value="invoices">
                Invoices & Payments
              </SelectItem>
              <SelectItem value="inventory">
                Inventory Management
              </SelectItem>
              <SelectItem value="workOrders">
                Work Orders
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

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
          />
        </div>

        <div className="space-y-3">
          <Label>Fields to Include</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
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

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() =>
              onPreview(
                selectedType,
                recordCount,
                selectedFields,
              )
            }
            variant="outline"
            disabled={
              isGenerating || selectedFields.length === 0
            }
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
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
          >
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
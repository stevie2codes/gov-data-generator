export interface DataTypeConfig {
  name: string;
  category: string;
  description: string;
  fields: string[];
}

export const dataTypeConfigs: Record<string, DataTypeConfig> = {
  citizens: {
    name: "Citizens",
    category: "People & Citizens",
    description: "Resident information and voter registration",
    fields: ["id", "firstName", "lastName", "ssn", "dateOfBirth", "address", "city", "state", "zipCode", "phone", "voterRegistered"],
  },
  employees: {
    name: "Government Employees",
    category: "People & Citizens",
    description: "Staff records and employment information",
    fields: ["id", "employeeId", "firstName", "lastName", "department", "position", "hireDate", "salary", "email", "phone", "clearanceLevel"],
  },
  services: {
    name: "Public Services",
    category: "Operations & Services",
    description: "Municipal services and programs",
    fields: ["id", "serviceName", "department", "description", "isActive", "budget", "contactPhone", "website", "hoursOfOperation"],
  },
  contracts: {
    name: "Government Contracts",
    category: "Operations & Services",
    description: "Vendor contracts and agreements",
    fields: ["id", "contractNumber", "vendor", "contractType", "value", "startDate", "endDate", "status", "department", "description"],
  },
  workOrders: {
    name: "Work Orders",
    category: "Operations & Services",
    description: "Maintenance and service requests",
    fields: ["id", "workOrderNumber", "workOrderType", "description", "location", "requestDate", "scheduledDate", "assignedTo", "priority", "status", "estimatedCost", "completionDate"],
  },
  balanceSheet: {
    name: "Balance Sheet",
    category: "Financial & Accounting",
    description: "Assets, liabilities, and equity positions",
    fields: ["id", "accountNumber", "accountName", "category", "currentPeriod", "priorPeriod", "change", "changePercent", "fiscalYear", "fund", "department", "notes"],
  },
  incomeStatement: {
    name: "Income Statement",
    category: "Financial & Accounting",
    description: "Revenue, expenses, and budget variance analysis",
    fields: ["id", "accountType", "fund", "function", "department", "division", "program", "location", "doeFunc", "grade", "object", "characterCode", "account", "fullAccount", "accountDescription", "fiscalCalendarName", "fiscalYear", "fiscalMonth", "calendarMonth"],
  },
  budget: {
    name: "Budget Records",
    category: "Financial & Accounting",
    description: "Budget planning and spending tracking",
    fields: ["id", "fiscalYear", "department", "category", "budgetedAmount", "spentAmount", "remainingAmount", "percentSpent", "lastUpdated", "status"],
  },
  purchaseOrders: {
    name: "Purchase Orders",
    category: "Financial & Accounting",
    description: "Procurement and purchasing records",
    fields: ["id", "poNumber", "vendor", "department", "description", "orderDate", "requestedBy", "totalAmount", "status", "deliveryDate", "approvedBy"],
  },
  invoices: {
    name: "Invoices & Payments",
    category: "Financial & Accounting",
    description: "Billing and payment processing",
    fields: ["id", "invoiceNumber", "vendor", "poNumber", "invoiceDate", "dueDate", "amount", "status", "department", "description", "paymentDate"],
  },
  permits: {
    name: "Permits & Applications",
    category: "Compliance & Licensing",
    description: "Building and development permits",
    fields: ["id", "permitNumber", "permitType", "applicantName", "propertyAddress", "applicationDate", "issueDate", "expirationDate", "status", "feeAmount", "inspector", "description"],
  },
  licenses: {
    name: "Business Licenses",
    category: "Compliance & Licensing",
    description: "Business licensing and registration",
    fields: ["id", "licenseNumber", "licenseType", "businessName", "ownerName", "businessAddress", "applicationDate", "issueDate", "renewalDate", "status", "annualFee", "phone"],
  },
  municipalAssets: {
    name: "Municipal Assets",
    category: "Assets & Inventory",
    description: "Government-owned property and equipment",
    fields: ["id", "assetTag", "assetType", "description", "department", "purchaseDate", "purchaseValue", "currentValue", "condition", "location", "serialNumber"],
  },
  inventory: {
    name: "Inventory Management",
    category: "Assets & Inventory",
    description: "Supplies and consumable inventory",
    fields: ["id", "itemCode", "itemName", "category", "description", "quantity", "unitPrice", "totalValue", "location", "reorderLevel", "supplier", "lastUpdated"],
  },
};

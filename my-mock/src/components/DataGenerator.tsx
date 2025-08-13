// Mock data generation utilities for government data
const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Sage', 'River', 'Jamie', 'Blake', 'Cameron', 'Drew', 'Emery'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Wilson', 'Moore', 'Thompson', 'White'];

const departments = ['Public Works', 'Parks & Recreation', 'Planning & Development', 'Public Safety', 'Health Services', 'Transportation', 'Environmental Services', 'Finance', 'Human Resources', 'Information Technology'];
const serviceTypes = ['Permits & Licensing', 'Public Transportation', 'Waste Management', 'Water & Utilities', 'Emergency Services', 'Social Services', 'Public Health', 'Parks Maintenance', 'Road Maintenance', 'Public Housing'];
const contractTypes = ['Construction', 'IT Services', 'Consulting', 'Equipment Purchase', 'Maintenance', 'Professional Services', 'Security Services', 'Utilities', 'Transportation', 'Cleaning Services'];
const assetTypes = ['Building', 'Vehicle', 'Equipment', 'Infrastructure', 'Technology', 'Land', 'Facility', 'Machinery'];
const cities = ['Springfield', 'Riverside', 'Franklin', 'Georgetown', 'Bristol', 'Clinton', 'Salem', 'Auburn', 'Newport', 'Madison'];
const states = ['CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI'];
const vendors = ['Metro Construction Inc', 'City Services Corp', 'Public Works Solutions', 'Municipal Tech Systems', 'Infrastructure Partners LLC', 'Government Solutions Group', 'Urban Development Co', 'Public Safety Equipment Inc'];

// New arrays for permits, licenses, and ERP data
const permitTypes = ['Building Permit', 'Zoning Permit', 'Demolition Permit', 'Electrical Permit', 'Plumbing Permit', 'HVAC Permit', 'Sign Permit', 'Excavation Permit', 'Tree Removal Permit', 'Special Event Permit'];
const licenseTypes = ['Business License', 'Liquor License', 'Food Service License', 'Taxi License', 'Street Vendor License', 'Contractor License', 'Professional License', 'Pet License', 'Marriage License', 'Hunting License'];
const inspectorNames = ['Sarah Johnson', 'Mike Chen', 'Lisa Rodriguez', 'David Kim', 'Jennifer Brown', 'Robert Wilson', 'Maria Garcia', 'James Miller'];
const businessTypes = ['Restaurant', 'Retail Store', 'Construction Company', 'Tech Startup', 'Medical Practice', 'Law Firm', 'Consulting', 'Manufacturing'];
const inventoryCategories = ['Office Supplies', 'Maintenance Equipment', 'IT Hardware', 'Vehicle Parts', 'Safety Equipment', 'Tools', 'Cleaning Supplies', 'Medical Supplies'];
const workOrderTypes = ['Maintenance', 'Repair', 'Installation', 'Inspection', 'Cleaning', 'Upgrade', 'Emergency', 'Preventive'];

// Financial statement data arrays
const assetCategories = ['Current Assets', 'Fixed Assets', 'Intangible Assets', 'Investments'];
const revenueCategories = ['Tax Revenue', 'Service Charges', 'Fines & Penalties', 'Intergovernmental', 'Investment Income', 'Other Revenue'];

const accountNames = {
  assets: ['Cash & Cash Equivalents', 'Accounts Receivable', 'Inventory', 'Prepaid Expenses', 'Investments', 'Property, Plant & Equipment', 'Accumulated Depreciation', 'Intangible Assets', 'Other Assets'],
  liabilities: ['Accounts Payable', 'Accrued Liabilities', 'Deferred Revenue', 'Bonds Payable', 'Notes Payable', 'Pension Liabilities', 'Other Long-term Liabilities'],
  equity: ['Fund Balance', 'Reserved Fund Balance', 'Unreserved Fund Balance', 'Designated Fund Balance'],
  revenue: ['Property Taxes', 'Sales Taxes', 'Income Taxes', 'Utility Charges', 'Permit Fees', 'License Fees', 'Fines & Penalties', 'Investment Income'],
  expenses: ['Salaries & Wages', 'Employee Benefits', 'Contract Services', 'Supplies', 'Utilities', 'Insurance', 'Depreciation', 'Interest Expense']
};

const generateRandomString = (length: number = 8) => {
  return Math.random().toString(36).substring(2, length + 2);
};

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateSSN = () => {
  return `${generateRandomNumber(100, 999)}-${generateRandomNumber(10, 99)}-${generateRandomNumber(1000, 9999)}`;
};

const generateEmployeeId = () => {
  return `EMP-${generateRandomNumber(1000, 9999)}`;
};

const generateContractNumber = () => {
  return `CT-${new Date().getFullYear()}-${generateRandomNumber(1000, 9999)}`;
};

const generateAssetTag = () => {
  return `AST-${generateRandomString(4).toUpperCase()}-${generateRandomNumber(100, 999)}`;
};

const generatePermitNumber = () => {
  return `PER-${new Date().getFullYear()}-${generateRandomNumber(10000, 99999)}`;
};

const generateLicenseNumber = () => {
  return `LIC-${generateRandomString(3).toUpperCase()}-${generateRandomNumber(1000, 9999)}`;
};

const generatePONumber = () => {
  return `PO-${new Date().getFullYear()}-${generateRandomNumber(1000, 9999)}`;
};

const generateInvoiceNumber = () => {
  return `INV-${generateRandomString(4).toUpperCase()}-${generateRandomNumber(1000, 9999)}`;
};

const generateWorkOrderNumber = () => {
  return `WO-${new Date().getFullYear()}-${generateRandomNumber(1000, 9999)}`;
};

const generateBudgetAmount = () => {
  return (Math.random() * 5000000 + 10000).toFixed(2);
};

const generateFinancialAmount = (min: number, max: number) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

const generateAccountNumber = (category: string) => {
  const prefixes = {
    'assets': '1000',
    'liabilities': '2000',
    'equity': '3000',
    'revenue': '4000',
    'expenses': '5000'
  };
  const prefix = prefixes[category as keyof typeof prefixes] || '0000';
  return `${prefix}-${generateRandomNumber(100, 999)}`;
};

const generateFiscalYear = () => {
  const currentYear = new Date().getFullYear();
  return `${currentYear}-${currentYear + 1}`;
};

export const generateMockData = (type: string, count: number, fields: string[]) => {
  const data = [];
  
  for (let i = 0; i < count; i++) {
    let record: any = {};
    
    switch (type) {
      case 'citizens':
        if (fields.includes('id')) record.id = i + 1;
        if (fields.includes('firstName')) record.firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        if (fields.includes('lastName')) record.lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        if (fields.includes('ssn')) record.ssn = generateSSN();
        if (fields.includes('dateOfBirth')) record.dateOfBirth = generateRandomDate(new Date(1940, 0, 1), new Date(2005, 11, 31)).toISOString().split('T')[0];
        if (fields.includes('address')) record.address = `${generateRandomNumber(100, 9999)} ${['Main St', 'Oak Ave', 'Elm St', 'Park Rd', 'First Ave'][Math.floor(Math.random() * 5)]}`;
        if (fields.includes('city')) record.city = cities[Math.floor(Math.random() * cities.length)];
        if (fields.includes('state')) record.state = states[Math.floor(Math.random() * states.length)];
        if (fields.includes('zipCode')) record.zipCode = generateRandomNumber(10000, 99999).toString();
        if (fields.includes('phone')) record.phone = `${generateRandomNumber(100, 999)}-${generateRandomNumber(100, 999)}-${generateRandomNumber(1000, 9999)}`;
        if (fields.includes('voterRegistered')) record.voterRegistered = Math.random() > 0.3;
        break;
        
      case 'employees':
        if (fields.includes('id')) record.id = i + 1;
        if (fields.includes('employeeId')) record.employeeId = generateEmployeeId();
        if (fields.includes('firstName')) record.firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        if (fields.includes('lastName')) record.lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        if (fields.includes('department')) record.department = departments[Math.floor(Math.random() * departments.length)];
        if (fields.includes('position')) record.position = ['Manager', 'Supervisor', 'Specialist', 'Coordinator', 'Analyst', 'Administrator', 'Technician', 'Officer'][Math.floor(Math.random() * 8)];
        if (fields.includes('hireDate')) record.hireDate = generateRandomDate(new Date(2010, 0, 1), new Date()).toISOString().split('T')[0];
        if (fields.includes('salary')) record.salary = generateRandomNumber(35000, 120000);
        if (fields.includes('email')) record.email = `${record.firstName?.toLowerCase()}.${record.lastName?.toLowerCase()}@city.gov`;
        if (fields.includes('phone')) record.phone = `${generateRandomNumber(100, 999)}-${generateRandomNumber(100, 999)}-${generateRandomNumber(1000, 9999)}`;
        if (fields.includes('clearanceLevel')) record.clearanceLevel = ['Public', 'Confidential', 'Restricted', 'Secret'][Math.floor(Math.random() * 4)];
        break;
        
      case 'services':
        if (fields.includes('id')) record.id = i + 1;
        if (fields.includes('serviceName')) record.serviceName = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
        if (fields.includes('department')) record.department = departments[Math.floor(Math.random() * departments.length)];
        if (fields.includes('description')) record.description = `${record.serviceName} provided by the ${record.department} department to serve the community`;
        if (fields.includes('isActive')) record.isActive = Math.random() > 0.1;
        if (fields.includes('budget')) record.budget = parseFloat(generateBudgetAmount());
        if (fields.includes('contactPhone')) record.contactPhone = `${generateRandomNumber(100, 999)}-${generateRandomNumber(100, 999)}-${generateRandomNumber(1000, 9999)}`;
        if (fields.includes('website')) record.website = `https://city.gov/${record.serviceName?.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and') || 'service'}`;
        if (fields.includes('hoursOfOperation')) record.hoursOfOperation = ['8:00 AM - 5:00 PM', '9:00 AM - 4:00 PM', '24/7', '7:00 AM - 3:00 PM'][Math.floor(Math.random() * 4)];
        break;
        
      case 'contracts':
        if (fields.includes('id')) record.id = i + 1;
        if (fields.includes('contractNumber')) record.contractNumber = generateContractNumber();
        if (fields.includes('vendor')) record.vendor = vendors[Math.floor(Math.random() * vendors.length)];
        if (fields.includes('contractType')) record.contractType = contractTypes[Math.floor(Math.random() * contractTypes.length)];
        if (fields.includes('value')) record.value = parseFloat(generateBudgetAmount());
        if (fields.includes('startDate')) record.startDate = generateRandomDate(new Date(2023, 0, 1), new Date()).toISOString().split('T')[0];
        if (fields.includes('endDate')) {
          const start = new Date(record.startDate || new Date());
          record.endDate = generateRandomDate(start, new Date(start.getTime() + 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
        }
        if (fields.includes('status')) record.status = ['Active', 'Pending', 'Completed', 'Cancelled', 'Under Review'][Math.floor(Math.random() * 5)];
        if (fields.includes('department')) record.department = departments[Math.floor(Math.random() * departments.length)];
        if (fields.includes('description')) record.description = `${record.contractType} services contract with ${record.vendor}`;
        break;
        
      case 'municipalAssets':
        if (fields.includes('id')) record.id = i + 1;
        if (fields.includes('assetTag')) record.assetTag = generateAssetTag();
        if (fields.includes('assetType')) record.assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)];
        if (fields.includes('description')) record.description = `${record.assetType} used for municipal operations`;
        if (fields.includes('department')) record.department = departments[Math.floor(Math.random() * departments.length)];
        if (fields.includes('purchaseDate')) record.purchaseDate = generateRandomDate(new Date(2015, 0, 1), new Date()).toISOString().split('T')[0];
        if (fields.includes('purchaseValue')) record.purchaseValue = parseFloat((Math.random() * 500000 + 1000).toFixed(2));
        if (fields.includes('currentValue')) record.currentValue = parseFloat((record.purchaseValue * (0.4 + Math.random() * 0.5)).toFixed(2));
        if (fields.includes('condition')) record.condition = ['Excellent', 'Good', 'Fair', 'Poor', 'Needs Replacement'][Math.floor(Math.random() * 5)];
        if (fields.includes('location')) record.location = `${cities[Math.floor(Math.random() * cities.length)]} Municipal Building`;
        if (fields.includes('serialNumber')) record.serialNumber = `SN-${generateRandomString(8).toUpperCase()}`;
        break;
        
      case 'budget':
        if (fields.includes('id')) record.id = i + 1;
        if (fields.includes('fiscalYear')) record.fiscalYear = generateRandomNumber(2020, 2025);
        if (fields.includes('department')) record.department = departments[Math.floor(Math.random() * departments.length)];
        if (fields.includes('category')) record.category = ['Personnel', 'Operations', 'Capital', 'Utilities', 'Supplies', 'Services', 'Equipment', 'Maintenance'][Math.floor(Math.random() * 8)];
        if (fields.includes('budgetedAmount')) record.budgetedAmount = parseFloat(generateBudgetAmount());
        if (fields.includes('spentAmount')) record.spentAmount = parseFloat((record.budgetedAmount * (0.2 + Math.random() * 0.6)).toFixed(2));
        if (fields.includes('remainingAmount')) record.remainingAmount = parseFloat((record.budgetedAmount - record.spentAmount).toFixed(2));
        if (fields.includes('percentSpent')) record.percentSpent = parseFloat(((record.spentAmount / record.budgetedAmount) * 100).toFixed(1));
        if (fields.includes('lastUpdated')) record.lastUpdated = generateRandomDate(new Date(2024, 0, 1), new Date()).toISOString().split('T')[0];
        if (fields.includes('status')) record.status = record.percentSpent > 90 ? 'Over Budget' : record.percentSpent > 75 ? 'Near Limit' : 'On Track';
        break;

      case 'permits':
        if (fields.includes('id')) record.id = i + 1;
        if (fields.includes('permitNumber')) record.permitNumber = generatePermitNumber();
        if (fields.includes('permitType')) record.permitType = permitTypes[Math.floor(Math.random() * permitTypes.length)];
        if (fields.includes('applicantName')) record.applicantName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        if (fields.includes('propertyAddress')) record.propertyAddress = `${generateRandomNumber(100, 9999)} ${['Main St', 'Oak Ave', 'Elm St', 'Park Rd', 'First Ave'][Math.floor(Math.random() * 5)]}`;
        if (fields.includes('applicationDate')) record.applicationDate = generateRandomDate(new Date(2024, 0, 1), new Date()).toISOString().split('T')[0];
        if (fields.includes('issueDate')) {
          const appDate = new Date(record.applicationDate || new Date());
          record.issueDate = Math.random() > 0.3 ? generateRandomDate(appDate, new Date(appDate.getTime() + 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] : null;
        }
        if (fields.includes('expirationDate')) {
          const issueDate = record.issueDate ? new Date(record.issueDate) : new Date();
          record.expirationDate = generateRandomDate(issueDate, new Date(issueDate.getTime() + 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
        }
        if (fields.includes('status')) record.status = ['Pending', 'Under Review', 'Approved', 'Issued', 'Denied', 'Expired'][Math.floor(Math.random() * 6)];
        if (fields.includes('feeAmount')) record.feeAmount = parseFloat((Math.random() * 5000 + 50).toFixed(2));
        if (fields.includes('inspector')) record.inspector = inspectorNames[Math.floor(Math.random() * inspectorNames.length)];
        if (fields.includes('description')) record.description = `${record.permitType} application for ${record.propertyAddress}`;
        break;

      case 'licenses':
        if (fields.includes('id')) record.id = i + 1;
        if (fields.includes('licenseNumber')) record.licenseNumber = generateLicenseNumber();
        if (fields.includes('licenseType')) record.licenseType = licenseTypes[Math.floor(Math.random() * licenseTypes.length)];
        if (fields.includes('businessName')) record.businessName = `${businessTypes[Math.floor(Math.random() * businessTypes.length)]} ${['Solutions', 'Group', 'Services', 'Corp', 'LLC', 'Inc'][Math.floor(Math.random() * 6)]}`;
        if (fields.includes('ownerName')) record.ownerName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        if (fields.includes('businessAddress')) record.businessAddress = `${generateRandomNumber(100, 9999)} ${['Commercial Blvd', 'Business Park Dr', 'Industry Way', 'Market St', 'Trade Center'][Math.floor(Math.random() * 5)]}`;
        if (fields.includes('applicationDate')) record.applicationDate = generateRandomDate(new Date(2023, 0, 1), new Date()).toISOString().split('T')[0];
        if (fields.includes('issueDate')) {
          const appDate = new Date(record.applicationDate || new Date());
          record.issueDate = Math.random() > 0.2 ? generateRandomDate(appDate, new Date(appDate.getTime() + 45 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] : null;
        }
        if (fields.includes('renewalDate')) {
          const issueDate = record.issueDate ? new Date(record.issueDate) : new Date();
          record.renewalDate = generateRandomDate(issueDate, new Date(issueDate.getTime() + 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
        }
        if (fields.includes('status')) record.status = ['Active', 'Expired', 'Suspended', 'Pending Renewal', 'Under Review'][Math.floor(Math.random() * 5)];
        if (fields.includes('annualFee')) record.annualFee = parseFloat((Math.random() * 2000 + 100).toFixed(2));
        if (fields.includes('phone')) record.phone = `${generateRandomNumber(100, 999)}-${generateRandomNumber(100, 999)}-${generateRandomNumber(1000, 9999)}`;
        break;

      case 'purchaseOrders':
        if (fields.includes('id')) record.id = i + 1;
        if (fields.includes('poNumber')) record.poNumber = generatePONumber();
        if (fields.includes('vendor')) record.vendor = vendors[Math.floor(Math.random() * vendors.length)];
        if (fields.includes('department')) record.department = departments[Math.floor(Math.random() * departments.length)];
        if (fields.includes('description')) record.description = `${contractTypes[Math.floor(Math.random() * contractTypes.length)]} for ${record.department}`;
        if (fields.includes('orderDate')) record.orderDate = generateRandomDate(new Date(2024, 0, 1), new Date()).toISOString().split('T')[0];
        if (fields.includes('requestedBy')) record.requestedBy = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        if (fields.includes('totalAmount')) record.totalAmount = parseFloat((Math.random() * 100000 + 500).toFixed(2));
        if (fields.includes('status')) record.status = ['Draft', 'Submitted', 'Approved', 'Ordered', 'Received', 'Cancelled'][Math.floor(Math.random() * 6)];
        if (fields.includes('deliveryDate')) {
          const orderDate = new Date(record.orderDate || new Date());
          record.deliveryDate = generateRandomDate(orderDate, new Date(orderDate.getTime() + 60 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
        }
        if (fields.includes('approvedBy')) record.approvedBy = record.status === 'Draft' ? null : `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        break;

      case 'invoices':
        if (fields.includes('id')) record.id = i + 1;
        if (fields.includes('invoiceNumber')) record.invoiceNumber = generateInvoiceNumber();
        if (fields.includes('vendor')) record.vendor = vendors[Math.floor(Math.random() * vendors.length)];
        if (fields.includes('poNumber')) record.poNumber = generatePONumber();
        if (fields.includes('invoiceDate')) record.invoiceDate = generateRandomDate(new Date(2024, 0, 1), new Date()).toISOString().split('T')[0];
        if (fields.includes('dueDate')) {
          const invDate = new Date(record.invoiceDate || new Date());
          record.dueDate = generateRandomDate(invDate, new Date(invDate.getTime() + 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
        }
        if (fields.includes('amount')) record.amount = parseFloat((Math.random() * 50000 + 100).toFixed(2));
        if (fields.includes('status')) record.status = ['Pending', 'Approved', 'Paid', 'Overdue', 'Disputed'][Math.floor(Math.random() * 5)];
        if (fields.includes('department')) record.department = departments[Math.floor(Math.random() * departments.length)];
        if (fields.includes('description')) record.description = `Invoice for ${contractTypes[Math.floor(Math.random() * contractTypes.length)].toLowerCase()} services`;
        if (fields.includes('paymentDate')) record.paymentDate = record.status === 'Paid' ? generateRandomDate(new Date(record.invoiceDate), new Date()).toISOString().split('T')[0] : null;
        break;

      case 'inventory':
        if (fields.includes('id')) record.id = i + 1;
        if (fields.includes('itemCode')) record.itemCode = `ITM-${generateRandomString(4).toUpperCase()}-${generateRandomNumber(100, 999)}`;
        if (fields.includes('itemName')) record.itemName = `${inventoryCategories[Math.floor(Math.random() * inventoryCategories.length)]} Item ${generateRandomNumber(1, 100)}`;
        if (fields.includes('category')) record.category = inventoryCategories[Math.floor(Math.random() * inventoryCategories.length)];
        if (fields.includes('description')) record.description = `Standard ${record.category?.toLowerCase()} for municipal operations`;
        if (fields.includes('quantity')) record.quantity = generateRandomNumber(0, 500);
        if (fields.includes('unitPrice')) record.unitPrice = parseFloat((Math.random() * 1000 + 5).toFixed(2));
        if (fields.includes('totalValue')) record.totalValue = parseFloat(((record.quantity || 0) * (record.unitPrice || 0)).toFixed(2));
        if (fields.includes('location')) record.location = `Warehouse ${['A', 'B', 'C'][Math.floor(Math.random() * 3)]}-${generateRandomNumber(1, 50)}`;
        if (fields.includes('reorderLevel')) record.reorderLevel = generateRandomNumber(10, 100);
        if (fields.includes('supplier')) record.supplier = vendors[Math.floor(Math.random() * vendors.length)];
        if (fields.includes('lastUpdated')) record.lastUpdated = generateRandomDate(new Date(2024, 0, 1), new Date()).toISOString().split('T')[0];
        break;

      case 'workOrders':
        if (fields.includes('id')) record.id = i + 1;
        if (fields.includes('workOrderNumber')) record.workOrderNumber = generateWorkOrderNumber();
        if (fields.includes('workOrderType')) record.workOrderType = workOrderTypes[Math.floor(Math.random() * workOrderTypes.length)];
        if (fields.includes('description')) record.description = `${record.workOrderType} work required for municipal facility`;
        if (fields.includes('location')) record.location = `${cities[Math.floor(Math.random() * cities.length)]} Municipal Building`;
        if (fields.includes('requestDate')) record.requestDate = generateRandomDate(new Date(2024, 0, 1), new Date()).toISOString().split('T')[0];
        if (fields.includes('scheduledDate')) {
          const reqDate = new Date(record.requestDate || new Date());
          record.scheduledDate = generateRandomDate(reqDate, new Date(reqDate.getTime() + 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
        }
        if (fields.includes('assignedTo')) record.assignedTo = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        if (fields.includes('priority')) record.priority = ['Low', 'Medium', 'High', 'Emergency'][Math.floor(Math.random() * 4)];
        if (fields.includes('status')) record.status = ['Open', 'In Progress', 'Completed', 'On Hold', 'Cancelled'][Math.floor(Math.random() * 5)];
        if (fields.includes('estimatedCost')) record.estimatedCost = parseFloat((Math.random() * 10000 + 100).toFixed(2));
        if (fields.includes('completionDate')) record.completionDate = record.status === 'Completed' ? generateRandomDate(new Date(record.scheduledDate), new Date()).toISOString().split('T')[0] : null;
        break;

      case 'balanceSheet':
        if (fields.includes('id')) record.id = i + 1;
        
        // Determine the section (Assets, Liabilities, or Equity) based on record position
        let section: 'assets' | 'liabilities' | 'equity';
        if (i < Math.floor(count / 3)) {
          section = 'assets';
        } else if (i < Math.floor((count * 2) / 3)) {
          section = 'liabilities';
        } else {
          section = 'equity';
        }
        
        if (fields.includes('accountNumber')) record.accountNumber = generateAccountNumber(section);
        if (fields.includes('accountName')) {
          record.accountName = accountNames[section][Math.floor(Math.random() * accountNames[section].length)];
        }
        if (fields.includes('category')) {
          if (section === 'assets') {
            record.category = assetCategories[Math.floor(Math.random() * assetCategories.length)];
          } else if (section === 'liabilities') {
            record.category = ['Current Liabilities', 'Long-term Liabilities', 'Contingent Liabilities'][Math.floor(Math.random() * 3)];
          } else {
            record.category = ['Contributed Capital', 'Retained Earnings', 'Treasury Stock', 'Accumulated Other Comprehensive Income'][Math.floor(Math.random() * 4)];
          }
        }
        if (fields.includes('currentPeriod')) record.currentPeriod = generateFinancialAmount(10000, 5000000);
        if (fields.includes('priorPeriod')) record.priorPeriod = generateFinancialAmount(10000, 5000000);
        if (fields.includes('change')) record.change = parseFloat((record.currentPeriod - record.priorPeriod).toFixed(2));
        if (fields.includes('changePercent')) record.changePercent = parseFloat(((record.change / record.priorPeriod) * 100).toFixed(2));
        if (fields.includes('fiscalYear')) record.fiscalYear = generateFiscalYear();
        if (fields.includes('fund')) record.fund = ['General Fund', 'Special Revenue Fund', 'Capital Projects Fund', 'Debt Service Fund', 'Enterprise Fund'][Math.floor(Math.random() * 5)];
        if (fields.includes('department')) record.department = departments[Math.floor(Math.random() * departments.length)];
        if (fields.includes('notes')) record.notes = `Account balance as of ${new Date().toISOString().split('T')[0]}`;
        break;

      case 'incomeStatement':
        if (fields.includes('id')) record.id = i + 1;
        if (fields.includes('accountNumber')) record.accountNumber = generateAccountNumber(record.category || 'revenue');
        if (fields.includes('accountName')) {
          const category = revenueCategories[Math.floor(Math.random() * revenueCategories.length)];
          record.category = category;
          if (category.includes('Revenue')) {
            record.accountName = accountNames.revenue[Math.floor(Math.random() * accountNames.revenue.length)];
          } else {
            record.accountName = accountNames.expenses[Math.floor(Math.random() * accountNames.expenses.length)];
          }
        }
        if (fields.includes('category')) record.category = revenueCategories[Math.floor(Math.random() * revenueCategories.length)];
        if (fields.includes('budgetedAmount')) record.budgetedAmount = generateFinancialAmount(10000, 2000000);
        if (fields.includes('actualAmount')) record.actualAmount = generateFinancialAmount(8000, 1800000);
        if (fields.includes('variance')) record.variance = parseFloat((record.actualAmount - record.budgetedAmount).toFixed(2));
        if (fields.includes('variancePercent')) record.variancePercent = parseFloat(((record.variance / record.budgetedAmount) * 100).toFixed(2));
        if (fields.includes('fiscalYear')) record.fiscalYear = generateFiscalYear();
        if (fields.includes('period')) record.period = ['Q1', 'Q2', 'Q3', 'Q4', 'Annual'][Math.floor(Math.random() * 5)];
        if (fields.includes('fund')) record.fund = ['General Fund', 'Special Revenue Fund', 'Capital Projects Fund', 'Debt Service Fund', 'Enterprise Fund'][Math.floor(Math.random() * 5)];
        if (fields.includes('department')) record.department = departments[Math.floor(Math.random() * departments.length)];
        if (fields.includes('notes')) record.notes = `Budget vs. actual for ${record.period} ${record.fiscalYear}`;
        break;
        
      default:
        record = { id: i + 1, name: `Item ${i + 1}`, value: generateRandomString() };
    }
    
    data.push(record);
  }
  
  return data;
};

export const convertToCSV = (data: any[]) => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
};
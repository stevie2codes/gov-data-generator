import express from 'express';
import cors from 'express-cors';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Function definitions for AI assistants
const functions = [
  {
    name: 'generate_government_data',
    description: 'Generate mock government data for testing and development purposes',
    parameters: {
      type: 'object',
      properties: {
        dataType: {
          type: 'string',
          description: 'Type of government data to generate',
          enum: [
            'citizens',
            'employees',
            'services',
            'contracts',
            'assets',
            'budget',
            'permits',
            'licenses',
            'purchaseOrders',
            'invoices',
            'inventory',
            'workOrders'
          ]
        },
        count: {
          type: 'number',
          description: 'Number of records to generate (1-1000)',
          minimum: 1,
          maximum: 1000
        },
        fields: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific fields to include in the generated data'
        }
      },
      required: ['dataType', 'count']
    }
  },
  {
    name: 'list_available_data_types',
    description: 'Get a list of all available government data types',
    parameters: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_data_type_info',
    description: 'Get information about a specific data type and its available fields',
    parameters: {
      type: 'object',
      properties: {
        dataType: {
          type: 'string',
          description: 'The data type to get information about'
        }
      },
      required: ['dataType']
    }
  }
];

// Mock data generation utilities
const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Sage', 'River'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
const cities = ['Springfield', 'Riverside', 'Franklin', 'Georgetown', 'Bristol', 'Clinton'];
const states = ['CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA'];
const departments = ['Public Works', 'Parks & Recreation', 'Planning & Development', 'Public Safety'];

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateSSN = () => {
  return `${generateRandomNumber(100, 999)}-${generateRandomNumber(10, 99)}-${generateRandomNumber(1000, 9999)}`;
};

const generateMockData = (type, count, fields = []) => {
  const data = [];
  
  for (let i = 0; i < count; i++) {
    let record = {};
    
    switch (type) {
      case 'citizens':
        if (fields.includes('id') || fields.length === 0) record.id = i + 1;
        if (fields.includes('firstName') || fields.length === 0) record.firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        if (fields.includes('lastName') || fields.length === 0) record.lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        if (fields.includes('ssn')) record.ssn = generateSSN();
        if (fields.includes('address')) record.address = `${generateRandomNumber(100, 9999)} Main St`;
        if (fields.includes('city') || fields.length === 0) record.city = cities[Math.floor(Math.random() * cities.length)];
        if (fields.includes('state') || fields.length === 0) record.state = states[Math.floor(Math.random() * states.length)];
        if (fields.includes('zipCode')) record.zipCode = generateRandomNumber(10000, 99999).toString();
        if (fields.includes('phone')) record.phone = `${generateRandomNumber(100, 999)}-${generateRandomNumber(100, 999)}-${generateRandomNumber(1000, 9999)}`;
        if (fields.includes('voterRegistered')) record.voterRegistered = Math.random() > 0.3;
        break;
        
      case 'employees':
        if (fields.includes('id') || fields.length === 0) record.id = i + 1;
        if (fields.includes('firstName') || fields.length === 0) record.firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        if (fields.includes('lastName') || fields.length === 0) record.lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        if (fields.includes('department') || fields.length === 0) record.department = departments[Math.floor(Math.random() * departments.length)];
        if (fields.includes('position')) record.position = ['Manager', 'Supervisor', 'Specialist', 'Coordinator'][Math.floor(Math.random() * 4)];
        if (fields.includes('salary')) record.salary = generateRandomNumber(30000, 120000);
        if (fields.includes('email')) record.email = `${record.firstName?.toLowerCase()}.${record.lastName?.toLowerCase()}@city.gov`;
        break;
        
      default:
        record.id = i + 1;
        record.name = `Sample ${type} ${i + 1}`;
        record.description = `Generated ${type} record for testing`;
    }
    
    data.push(record);
  }
  
  return data;
};

// Function implementations
const functionImplementations = {
  generate_government_data: async (args) => {
    const { dataType, count, fields = [] } = args;
    
    if (!dataType) {
      throw new Error('dataType is required');
    }
    
    if (count < 1 || count > 1000) {
      throw new Error('count must be between 1 and 1000');
    }
    
    const data = generateMockData(dataType, count, fields);
    
    return {
      success: true,
      message: `Generated ${count} ${dataType} records${fields.length > 0 ? ` with fields: ${fields.join(', ')}` : ''}`,
      dataType,
      count,
      fields: fields.length > 0 ? fields : 'all available fields',
      data
    };
  },
  
  list_available_data_types: async () => {
    const dataTypes = [
      'citizens',
      'employees', 
      'services',
      'contracts',
      'assets',
      'budget',
      'permits',
      'licenses',
      'purchaseOrders',
      'invoices',
      'inventory',
      'workOrders'
    ];
    
    return {
      success: true,
      message: 'Available government data types',
      dataTypes,
      count: dataTypes.length
    };
  },
  
  get_data_type_info: async (args) => {
    const { dataType } = args;
    
    const fieldInfo = {
      citizens: ['id', 'firstName', 'lastName', 'ssn', 'address', 'city', 'state', 'zipCode', 'phone', 'voterRegistered'],
      employees: ['id', 'firstName', 'lastName', 'department', 'position', 'salary', 'email'],
      services: ['id', 'serviceName', 'department', 'description', 'isActive', 'budget'],
      contracts: ['id', 'contractNumber', 'vendor', 'contractType', 'value', 'startDate', 'endDate', 'status'],
      assets: ['id', 'assetTag', 'assetType', 'location', 'purchaseDate', 'value', 'condition'],
      budget: ['id', 'fiscalYear', 'department', 'category', 'budgetedAmount', 'spentAmount'],
      permits: ['id', 'permitNumber', 'applicantName', 'permitType', 'issueDate', 'expiryDate', 'status'],
      licenses: ['id', 'licenseNumber', 'businessName', 'licenseType', 'issueDate', 'expiryDate', 'status'],
      purchaseOrders: ['id', 'poNumber', 'vendor', 'orderDate', 'totalAmount', 'status'],
      invoices: ['id', 'invoiceNumber', 'vendor', 'poNumber', 'invoiceDate', 'dueDate', 'amount', 'status'],
      inventory: ['id', 'itemName', 'category', 'quantity', 'unitPrice', 'location', 'lastUpdated'],
      workOrders: ['id', 'workOrderNumber', 'description', 'priority', 'assignedTo', 'startDate', 'completionDate', 'status']
    };
    
    if (!fieldInfo[dataType]) {
      throw new Error(`Unknown data type: ${dataType}`);
    }
    
    return {
      success: true,
      dataType,
      availableFields: fieldInfo[dataType],
      description: `Information about ${dataType} data type`
    };
  }
};

// API endpoints for AI assistants
app.get('/', (req, res) => {
  res.json({
    message: 'Government Data Generator - AI Assistant Integration',
    version: '1.0.0',
    functions: functions.map(f => ({ name: f.name, description: f.description })),
    endpoints: {
      '/functions': 'GET - List available functions',
      '/call': 'POST - Call a function',
      '/health': 'GET - Health check'
    }
  });
});

// List available functions
app.get('/functions', (req, res) => {
  res.json({ functions });
});

// Call a function
app.post('/call', async (req, res) => {
  const { function_name, arguments: args } = req.body;
  
  if (!function_name) {
    return res.status(400).json({ error: 'function_name is required' });
  }
  
  if (!functionImplementations[function_name]) {
    return res.status(400).json({ error: `Unknown function: ${function_name}` });
  }
  
  try {
    const result = await functionImplementations[function_name](args || {});
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    functions: Object.keys(functionImplementations)
  });
});

app.listen(PORT, () => {
  console.log(`🤖 AI Assistant Integration running on http://localhost:${PORT}`);
  console.log(`📋 Available functions:`);
  functions.forEach(f => {
    console.log(`   ${f.name} - ${f.description}`);
  });
  console.log(`\n🔗 Integration URLs:`);
  console.log(`   GET  / - API info`);
  console.log(`   GET  /functions - List functions`);
  console.log(`   POST /call - Call a function`);
  console.log(`   GET  /health - Health check`);
}); 
import express from 'express';
import cors from 'cors';

// Mock data generation utilities
const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Sage', 'River'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
const cities = ['Springfield', 'Riverside', 'Franklin', 'Georgetown', 'Bristol', 'Clinton'];
const states = ['CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA'];
const departments = ['Public Works', 'Parks & Recreation', 'Planning & Development', 'Public Safety'];

const generateRandomString = (length = 8) => {
  return Math.random().toString(36).substring(2, length + 2);
};

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateSSN = () => {
  return `${generateRandomNumber(100, 999)}-${generateRandomNumber(10, 99)}-${generateRandomNumber(1000, 9999)}`;
};

const generateMockData = (type, count, fields) => {
  const data = [];
  
  for (let i = 0; i < count; i++) {
    let record = {};
    
    switch (type) {
      case 'citizens':
        if (fields.includes('id')) record.id = i + 1;
        if (fields.includes('firstName')) record.firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        if (fields.includes('lastName')) record.lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        if (fields.includes('ssn')) record.ssn = generateSSN();
        if (fields.includes('address')) record.address = `${generateRandomNumber(100, 9999)} Main St`;
        if (fields.includes('city')) record.city = cities[Math.floor(Math.random() * cities.length)];
        if (fields.includes('state')) record.state = states[Math.floor(Math.random() * states.length)];
        if (fields.includes('zipCode')) record.zipCode = generateRandomNumber(10000, 99999).toString();
        if (fields.includes('phone')) record.phone = `${generateRandomNumber(100, 999)}-${generateRandomNumber(100, 999)}-${generateRandomNumber(1000, 9999)}`;
        if (fields.includes('voterRegistered')) record.voterRegistered = Math.random() > 0.3;
        break;
        
      case 'employees':
        if (fields.includes('id')) record.id = i + 1;
        if (fields.includes('firstName')) record.firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        if (fields.includes('lastName')) record.lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        if (fields.includes('department')) record.department = departments[Math.floor(Math.random() * departments.length)];
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

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Government Data Generator API',
    version: '1.0.0',
    endpoints: {
      '/generate': 'POST - Generate mock data',
      '/types': 'GET - List available data types',
      '/health': 'GET - Health check'
    }
  });
});

// List available data types
app.get('/types', (req, res) => {
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
  
  res.json({ dataTypes });
});

// Generate mock data
app.post('/generate', (req, res) => {
  const { dataType, count = 10, fields = [] } = req.body;
  
  if (!dataType) {
    return res.status(400).json({ error: 'dataType is required' });
  }
  
  if (count < 1 || count > 1000) {
    return res.status(400).json({ error: 'count must be between 1 and 1000' });
  }
  
  try {
    const data = generateMockData(dataType, count, fields);
    res.json({
      success: true,
      dataType,
      count,
      fields,
      data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Government Data Generator API running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   GET  / - API info`);
  console.log(`   GET  /types - List data types`);
  console.log(`   POST /generate - Generate mock data`);
  console.log(`   GET  /health - Health check`);
}); 
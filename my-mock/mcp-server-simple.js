import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Mock data generation utilities (simplified version)
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

const server = new Server(
  {
    name: 'government-data-generator',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'generate_government_data',
        description: 'Generate mock government data for testing and development',
        inputSchema: {
          type: 'object',
          properties: {
            dataType: {
              type: 'string',
              description: 'Type of government data to generate (citizens, employees, permits, etc.)',
            },
            count: {
              type: 'number',
              description: 'Number of records to generate (1-1000)',
              minimum: 1,
              maximum: 1000,
            },
            fields: {
              type: 'array',
              items: { type: 'string' },
              description: 'Fields to include in the generated data',
            },
          },
          required: ['dataType', 'count', 'fields'],
        },
      },
      {
        name: 'list_data_types',
        description: 'List all available government data types',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Tool to generate government data
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'generate_government_data': {
      const { dataType, count, fields } = args;

      try {
        const data = generateMockData(dataType, count, fields);
        
        return {
          content: [
            {
              type: 'text',
              text: `Generated ${count} ${dataType} records with fields: ${fields.join(', ')}`,
            },
            {
              type: 'json',
              data: data,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error generating data: ${error}`,
            },
          ],
        };
      }
    }

    case 'list_data_types': {
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
        content: [
          {
            type: 'text',
            text: `Available data types: ${dataTypes.join(', ')}`,
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport); 
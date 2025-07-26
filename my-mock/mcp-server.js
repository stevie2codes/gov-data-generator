import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { generateMockData } from './src/components/DataGenerator.ts';

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
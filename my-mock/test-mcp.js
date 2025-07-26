import { generateMockData } from './src/components/DataGenerator.ts';

// Test the data generator directly
console.log('Testing Government Data Generator...');

try {
  const citizens = generateMockData('citizens', 3, ['firstName', 'lastName', 'city', 'state']);
  console.log('✅ Generated citizens data:', citizens);
  
  const employees = generateMockData('employees', 2, ['firstName', 'lastName', 'department', 'position']);
  console.log('✅ Generated employees data:', employees);
  
  console.log('🎉 MCP server should work! You can now:');
  console.log('1. Run: npm run mcp');
  console.log('2. Connect it to an MCP client');
  console.log('3. Use natural language to generate data');
  
} catch (error) {
  console.error('❌ Error:', error);
} 
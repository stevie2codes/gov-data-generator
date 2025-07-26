// Simulate AI Assistant using Government Data Generator
const BASE_URL = 'http://localhost:3002';

// Function to call the AI integration
async function callFunction(functionName, args = {}) {
  try {
    const response = await fetch(`${BASE_URL}/call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        function_name: functionName,
        arguments: args
      })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error calling function:', error);
    return { error: error.message };
  }
}

// Simulate AI Assistant conversations
async function simulateAIConversation() {
  console.log('🤖 AI Assistant Simulation\n');
  
  // Example 1: User asks to generate citizen data
  console.log('👤 User: "Generate 5 citizen records with SSN and voting status"');
  console.log('🤖 AI: I\'ll generate 5 citizen records with SSN and voting status for you.');
  
  const citizenData = await callFunction('generate_government_data', {
    dataType: 'citizens',
    count: 5,
    fields: ['firstName', 'lastName', 'ssn', 'voterRegistered']
  });
  
  console.log('📊 Generated Data:', JSON.stringify(citizenData.data, null, 2));
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Example 2: User asks what data types are available
  console.log('👤 User: "What government data types are available?"');
  console.log('🤖 AI: Let me check what government data types are available.');
  
  const dataTypes = await callFunction('list_available_data_types');
  
  console.log('📋 Available Data Types:', dataTypes.dataTypes.join(', '));
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Example 3: User asks about employee data fields
  console.log('👤 User: "Show me the fields available for employee data"');
  console.log('🤖 AI: I\'ll get the field information for employee data.');
  
  const employeeInfo = await callFunction('get_data_type_info', {
    dataType: 'employees'
  });
  
  console.log('📋 Employee Fields:', employeeInfo.availableFields.join(', '));
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Example 4: Generate employee data
  console.log('👤 User: "Create 3 employee records with department and salary"');
  console.log('🤖 AI: I\'ll create 3 employee records with department and salary information.');
  
  const employeeData = await callFunction('generate_government_data', {
    dataType: 'employees',
    count: 3,
    fields: ['firstName', 'lastName', 'department', 'salary']
  });
  
  console.log('📊 Generated Employee Data:', JSON.stringify(employeeData.data, null, 2));
}

// Run the simulation
simulateAIConversation().catch(console.error); 
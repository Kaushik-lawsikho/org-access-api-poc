const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Complete API Validation Suite');
console.log('='.repeat(60));
console.log('This script will run all tests and validations to ensure');
console.log('your API is working correctly before deployment.');
console.log('='.repeat(60));

const validationSteps = [
  {
    name: 'Database Migration',
    command: 'npm run update-models',
    description: 'Updating database schema...'
  },
  {
    name: 'Seed Test Data',
    command: 'npm run seed',
    description: 'Seeding database with test data...'
  },
  {
    name: 'Jest Unit Tests',
    command: 'npm run test:all',
    description: 'Running comprehensive unit tests...'
  },
  {
    name: 'Security Tests',
    command: 'npm run test:security',
    description: 'Running security isolation tests...'
  },
  {
    name: 'Performance Tests',
    command: 'npm run test:performance',
    description: 'Running performance tests...'
  },
  {
    name: 'API Validation',
    command: 'node validate-api.js',
    description: 'Running end-to-end API validation...'
  }
];

let passedSteps = 0;
let failedSteps = 0;

async function runValidationStep(step) {
  try {
    console.log(`\n🔧 ${step.description}`);
    console.log('-'.repeat(40));
    
    execSync(step.command, { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '../..')
    });
    
    console.log(`✅ ${step.name} - COMPLETED`);
    passedSteps++;
  } catch (error) {
    console.log(`❌ ${step.name} - FAILED`);
    console.log(`Error: ${error.message}`);
    failedSteps++;
    
    // Ask if user wants to continue
    console.log('\n⚠️  This step failed. Do you want to continue with the next step?');
    console.log('   (The validation will continue automatically in 5 seconds...)');
    
    // Wait 5 seconds and continue
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

async function runCompleteValidation() {
  console.log('Starting complete validation process...\n');
  
  for (const step of validationSteps) {
    await runValidationStep(step);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Complete Validation Results');
  console.log('='.repeat(60));
  console.log(`✅ Completed: ${passedSteps}`);
  console.log(`❌ Failed: ${failedSteps}`);
  console.log(`📈 Total: ${passedSteps + failedSteps}`);
  
  if (failedSteps === 0) {
    console.log('\n🎉 All validations passed successfully!');
    console.log('🚀 Your API is ready for production deployment!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Start your server: npm run dev');
    console.log('   2. Access Swagger docs: http://localhost:3000/api-docs');
    console.log('   3. Test your API endpoints');
    console.log('   4. Deploy to production when ready');
  } else {
    console.log('\n💥 Some validations failed. Please check the errors above.');
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure your database is running');
    console.log('   2. Check your .env file configuration');
    console.log('   3. Ensure all dependencies are installed');
    console.log('   4. Run individual test commands to debug specific issues');
  }
}

runCompleteValidation().catch(console.error);

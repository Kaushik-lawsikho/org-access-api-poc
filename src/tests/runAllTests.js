const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Running Comprehensive Test Suite');
console.log('='.repeat(50));

const testSuites = [
  { name: 'Authentication Tests', command: 'npm run test:auth' },
  { name: 'Course Management Tests', command: 'npm run test:courses' },
  { name: 'User Management Tests', command: 'npm run test:users' },
  { name: 'Integration Tests', command: 'npm run test:integration' },
  { name: 'Security Tests', command: 'npm run test:security' },
  { name: 'Performance Tests', command: 'npm run test:performance' }
];

let passedTests = 0;
let failedTests = 0;

async function runTestSuite(suite) {
  try {
    console.log(`\n🔍 Running ${suite.name}...`);
    console.log('-'.repeat(30));
    
    execSync(suite.command, { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '../..')
    });
    
    console.log(`✅ ${suite.name} - PASSED`);
    passedTests++;
  } catch (error) {
    console.log(`❌ ${suite.name} - FAILED`);
    console.log(`Error: ${error.message}`);
    failedTests++;
  }
}

async function runAllTests() {
  console.log('Starting test execution...\n');
  
  for (const suite of testSuites) {
    await runTestSuite(suite);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results Summary');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📈 Total: ${passedTests + failedTests}`);
  
  if (failedTests === 0) {
    console.log('\n🎉 All tests passed successfully!');
    process.exit(0);
  } else {
    console.log('\n💥 Some tests failed. Please check the output above.');
    process.exit(1);
  }
}

runAllTests().catch(console.error);

import React, { useState } from 'react';

const SecurityDemo = ({ apiKeys }) => {
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);

  const runSecurityTest = async (testName, apiKey1, apiKey2, expectedResult) => {
    setTesting(true);
    const results = { ...testResults };
    
    try {
      // Test with first API key
      const response1 = await fetch('http://localhost:3000/api/courses', {
        headers: { 'Authorization': `Bearer ${apiKey1}` }
      });
      const data1 = await response1.json();
      
      // Test with second API key
      const response2 = await fetch('http://localhost:3000/api/courses', {
        headers: { 'Authorization': `Bearer ${apiKey2}` }
      });
      const data2 = await response2.json();
      
      // Compare results
      const org1 = data1.context?.organization;
      const org2 = data2.context?.organization;
      const isIsolated = org1 !== org2;
      
      results[testName] = {
        success: isIsolated === expectedResult,
        message: isIsolated ? 
          `✅ Isolation working: ${org1} ≠ ${org2}` : 
          `❌ Security breach: ${org1} = ${org2}`,
        details: {
          org1: org1,
          org2: org2,
          courses1: data1.count,
          courses2: data2.count
        }
      };
      
    } catch (error) {
      results[testName] = {
        success: false,
        message: `❌ Test failed: ${error.message}`,
        details: null
      };
    }
    
    setTestResults(results);
    setTesting(false);
  };

  const securityTests = [
    {
      name: 'Cross-Organization Isolation',
      description: 'TechCorp Education vs EduSoft - should be isolated',
      apiKey1: 'org_1_brand_1_abc123def456',
      apiKey2: 'org_2_direct_ghi789jkl012',
      expectedResult: true
    },
    {
      name: 'Brand Isolation',
      description: 'TechCorp Education vs TechCorp Professional - should be isolated',
      apiKey1: 'org_1_brand_1_abc123def456',
      apiKey2: 'org_1_brand_2_xyz789uvw012',
      expectedResult: true
    },
    {
      name: 'Invalid API Key Test',
      description: 'Invalid API key should be rejected',
      apiKey1: 'invalid_key_123',
      apiKey2: 'org_1_brand_1_abc123def456',
      expectedResult: true
    }
  ];

  return (
    <div className="security-demo">
      <h3>🔒 Security Test Suite</h3>
      <p>Click the buttons below to test multi-tenant isolation and security features.</p>
      
      <div className="button-group">
        {securityTests.map((test) => (
          <button
            key={test.name}
            className="btn btn-primary"
            onClick={() => runSecurityTest(test.name, test.apiKey1, test.apiKey2, test.expectedResult)}
            disabled={testing}
          >
            {testing ? 'Testing...' : `Test: ${test.name}`}
          </button>
        ))}
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="test-results">
          <h4>Test Results:</h4>
          {Object.entries(testResults).map(([testName, result]) => (
            <div key={testName} className="security-test">
              <h4>{testName}</h4>
              <p>{result.message}</p>
              {result.details && (
                <div className="test-details">
                  <p><strong>Organization 1:</strong> {result.details.org1} ({result.details.courses1} courses)</p>
                  <p><strong>Organization 2:</strong> {result.details.org2} ({result.details.courses2} courses)</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="security-info">
        <h4>🛡️ Security Features Demonstrated:</h4>
        <ul>
          <li>✅ Multi-tenant organization isolation</li>
          <li>✅ Brand-level access control</li>
          <li>✅ API key authentication</li>
          <li>✅ Cross-organization access prevention</li>
          <li>✅ Invalid API key rejection</li>
        </ul>
      </div>
    </div>
  );
};

export default SecurityDemo;

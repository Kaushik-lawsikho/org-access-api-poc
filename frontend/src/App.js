import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import ApiKeySelector from './components/ApiKeySelector';
import OrganizationInfo from './components/OrganizationInfo';
import CourseList from './components/CourseList';
import CourseSearch from './components/CourseSearch';
import SecurityDemo from './components/SecurityDemo';

function App() {
  const [selectedApiKey, setSelectedApiKey] = useState('');
  const [apiKeyInfo, setApiKeyInfo] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKeys = [
    {
      key: 'org_1_brand_1_abc123def456',
      name: 'TechCorp Education',
      organization: 'TechCorp',
      brand: 'TechCorp Education',
      description: 'Access to TechCorp Education courses only'
    },
    {
      key: 'org_1_brand_2_xyz789uvw012',
      name: 'TechCorp Professional',
      organization: 'TechCorp',
      brand: 'TechCorp Professional',
      description: 'Access to TechCorp Professional courses only'
    },
    {
      key: 'org_2_direct_ghi789jkl012',
      name: 'EduSoft Direct',
      organization: 'EduSoft',
      brand: null,
      description: 'Direct access to EduSoft organization courses'
    },
    {
      key: 'org_3_brand_3_def456ghi789',
      name: 'LearnHub Kids',
      organization: 'LearnHub',
      brand: 'LearnHub Kids',
      description: 'Access to LearnHub Kids courses only'
    },
    {
      key: 'org_3_brand_4_mno123pqr456',
      name: 'LearnHub Adults',
      organization: 'LearnHub',
      brand: 'LearnHub Adults',
      description: 'Access to LearnHub Adults courses only'
    }
  ];

  const handleApiKeyChange = (apiKey) => {
    setSelectedApiKey(apiKey);
    setApiKeyInfo(null);
    setCourses([]);
    setError(null);
  };

  const fetchOrganizationInfo = async () => {
    if (!selectedApiKey) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/api/org/info', {
        headers: {
          'Authorization': `Bearer ${selectedApiKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch organization info');
      }
      
      const data = await response.json();
      setApiKeyInfo(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    if (!selectedApiKey) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/api/courses', {
        headers: {
          'Authorization': `Bearer ${selectedApiKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      
      const data = await response.json();
      setCourses(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchCourses = async (query) => {
    if (!selectedApiKey || !query) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3000/api/courses/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${selectedApiKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to search courses');
      }
      
      const data = await response.json();
      setCourses(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Header />
      
      <div className="container">
        <div className="demo-section">
          <h2>🔑 API Key Selection</h2>
          <ApiKeySelector 
            apiKeys={apiKeys}
            selectedApiKey={selectedApiKey}
            onApiKeyChange={handleApiKeyChange}
          />
        </div>

        {selectedApiKey && (
          <div className="demo-section">
            <h2>🏢 Organization Information</h2>
            <button 
              className="btn btn-primary"
              onClick={fetchOrganizationInfo}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Organization Info'}
            </button>
            
            {apiKeyInfo && (
              <OrganizationInfo info={apiKeyInfo} />
            )}
          </div>
        )}

        {selectedApiKey && (
          <div className="demo-section">
            <h2>📚 Course Management</h2>
            <div className="button-group">
              <button 
                className="btn btn-primary"
                onClick={fetchCourses}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Get All Courses'}
              </button>
            </div>
            
            <CourseSearch onSearch={searchCourses} loading={loading} />
            
            {courses.length > 0 && (
              <CourseList courses={courses} />
            )}
          </div>
        )}

        <div className="demo-section">
          <h2>🔒 Security Demonstration</h2>
          <SecurityDemo apiKeys={apiKeys} />
        </div>

        {error && (
          <div className="error-message">
            <h3>❌ Error</h3>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
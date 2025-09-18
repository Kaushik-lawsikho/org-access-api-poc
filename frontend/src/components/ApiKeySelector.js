import React from 'react';

const ApiKeySelector = ({ apiKeys, selectedApiKey, onApiKeyChange }) => {
  return (
    <div className="api-key-selector">
      {apiKeys.map((apiKey) => (
        <div
          key={apiKey.key}
          className={`api-key-card ${selectedApiKey === apiKey.key ? 'selected' : ''}`}
          onClick={() => onApiKeyChange(apiKey.key)}
        >
          <h3>{apiKey.name}</h3>
          <p><strong>Organization:</strong> {apiKey.organization}</p>
          {apiKey.brand && <p><strong>Brand:</strong> {apiKey.brand}</p>}
          <p><strong>Description:</strong> {apiKey.description}</p>
          <div className="key">
            <strong>API Key:</strong> {apiKey.key}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApiKeySelector;

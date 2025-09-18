import React, { useState } from 'react';

const CourseSearch = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Search courses by title or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          type="submit" 
          className="btn btn-secondary"
          disabled={loading || !query.trim()}
          style={{ marginLeft: '10px' }}
        >
          {loading ? <span className="loading"></span> : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default CourseSearch;

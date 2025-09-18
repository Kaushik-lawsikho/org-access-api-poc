import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          🎓 Organization Access API Demo
        </div>
        <div className="status">
          <div className="status-dot"></div>
          <span>API Server Online</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

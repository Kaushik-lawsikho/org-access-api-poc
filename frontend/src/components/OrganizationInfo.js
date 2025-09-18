import React from 'react';

const OrganizationInfo = ({ info }) => {
  return (
    <div className="org-info">
      <h3>🏢 Organization Details</h3>
      <div className="info-grid">
        <div className="info-item">
          <label>Organization ID</label>
          <span>{info.organization.id}</span>
        </div>
        <div className="info-item">
          <label>Organization Name</label>
          <span>{info.organization.name}</span>
        </div>
        <div className="info-item">
          <label>Description</label>
          <span>{info.organization.description}</span>
        </div>
        <div className="info-item">
          <label>Access Level</label>
          <span>{info.accessLevel}</span>
        </div>
        {info.brand && (
          <>
            <div className="info-item">
              <label>Brand ID</label>
              <span>{info.brand.id}</span>
            </div>
            <div className="info-item">
              <label>Brand Name</label>
              <span>{info.brand.name}</span>
            </div>
            <div className="info-item">
              <label>Brand Description</label>
              <span>{info.brand.description}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrganizationInfo;

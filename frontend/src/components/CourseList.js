import React from 'react';

const CourseList = ({ courses }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="course-list">
      {courses.map((course) => (
        <div key={course.id} className="course-card">
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <div className="course-meta">
            <span>ID: {course.id}</span>
            <span>Created: {formatDate(course.createdAt)}</span>
          </div>
          {course.brand && (
            <div className="course-meta">
              <span>Brand: {course.brand.name}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseList;

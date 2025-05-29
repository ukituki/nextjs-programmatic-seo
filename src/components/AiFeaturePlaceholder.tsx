// src/components/AiFeaturePlaceholder.tsx
import React from 'react';

const AiFeaturePlaceholder: React.FC = () => {
  const sectionStyle: React.CSSProperties = {
    marginTop: '30px',
    padding: '20px',
    border: '1px dashed #0070f3',
    borderRadius: '8px',
    backgroundColor: '#f0f8ff', // Light blue background
    textAlign: 'center',
  };

  const headingStyle: React.CSSProperties = {
    color: '#0070f3',
    marginBottom: '10px',
  };

  const paragraphStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#333',
  };

  return (
    <div style={sectionStyle}>
      <h2 style={headingStyle}>AI Feature Showcase</h2>
      <p style={paragraphStyle}>
        This section will demonstrate AI-powered product recommendations and insights once data extraction capabilities are restored.
        Currently, this is a placeholder.
      </p>
    </div>
  );
};

export default AiFeaturePlaceholder;

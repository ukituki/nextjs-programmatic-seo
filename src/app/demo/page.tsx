// src/app/demo/page.tsx
import React from 'react';
import LeadGenerationForm from '@/components/LeadGenerationForm'; // Import the form
import AiFeaturePlaceholder from '@/components/AiFeaturePlaceholder'; // Import the AI placeholder

const DemoPage: React.FC = () => {
  const enableDemoPage = process.env.NEXT_PUBLIC_ENABLE_DEMO_PAGE === 'true';

  if (!enableDemoPage) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Demo Not Available</h1>
        <p>This feature is currently switched off.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Demo Page</h1>
      <p>This is a placeholder for demo content.</p>
      <p>Further components and features for the demo will be added here.</p>
      <hr style={{ margin: '20px 0' }} />
      <LeadGenerationForm />
      <AiFeaturePlaceholder />
    </div>
  );
};

export default DemoPage;

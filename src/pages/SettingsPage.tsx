import React from 'react';
import BotScenario from '../components/BotScenario';
import BotDocs from '@/components/BotDocs';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <BotDocs />
      <BotScenario />
    </div>
  );
};

export default SettingsPage;

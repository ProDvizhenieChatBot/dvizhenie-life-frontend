import React from 'react';
import UserList from '../components/UserList';
import BotScenario from '../components/BotScenario';

const AdminPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <UserList />
      <BotScenario />
    </div>
  );
};

export default AdminPage;

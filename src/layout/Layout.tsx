import React from 'react';
import { useAuth } from '@/components/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import NavigationHeader from '../components/NavigationHeader';
import { LogOut } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Панель управления</h1>
          </div>
          <NavigationHeader />
          <div className="flex items-center space-x-4">
            <span>Добро пожаловать, {user?.username}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-600 hover:text-black hover:opacity-80 hover:!bg-transparent font-medium"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Выход
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default MainLayout;

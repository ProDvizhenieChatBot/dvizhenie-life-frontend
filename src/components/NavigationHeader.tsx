import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Settings, LogOut } from 'lucide-react';

const NavigationHeader: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    // Здесь будет логика выхода из системы
    console.log('Выход из системы');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center space-x-6">
            <nav className="flex space-x-2">
              <Link to="/applications">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-gray-600 hover:text-black hover:opacity-80 hover:!bg-transparent ${
                    isActive('/applications') ? 'font-semibold text-black' : 'font-medium'
                  }`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Список анкет
                </Button>
              </Link>

              <Link to="/admin">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-gray-600 hover:text-black hover:opacity-80 hover:!bg-transparent ${
                    isActive('/admin') ? 'font-semibold text-black' : 'font-medium'
                  }`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Админка
                </Button>
              </Link>
            </nav>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-600 hover:text-black hover:opacity-80 hover:!bg-transparent font-medium"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Выход
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;

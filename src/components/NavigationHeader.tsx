import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Settings } from 'lucide-react';

const NavigationHeader: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center space-x-6">
            <nav className="flex space-x-2">
              <NavLink
                to="/applications"
                aria-current={isActive('/applications') ? 'page' : undefined}
              >
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
              </NavLink>

              <NavLink to="/settings" aria-current={isActive('/settings') ? 'page' : undefined}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-gray-600 hover:text-black hover:opacity-80 hover:!bg-transparent ${
                    isActive('/settings') ? 'font-semibold text-black' : 'font-medium'
                  }`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Настройки
                </Button>
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;

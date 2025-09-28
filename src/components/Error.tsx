import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorProps {
  title: string;
  message: string;
  showBackButton?: boolean;
}

const Error: React.FC<ErrorProps> = ({ title, message, showBackButton = false }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-16 h-16 text-destructive" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-base">{message}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {showBackButton && (
            <Link to="/applications">
              <Button>
                <Home className="w-4 h-4 mr-2" />
                Вернуться на главную
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Error;

import React from 'react';

const LoginLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">{children}</div>
  );
};

export default LoginLayout;

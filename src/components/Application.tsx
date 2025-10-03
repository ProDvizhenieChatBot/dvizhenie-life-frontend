import React from 'react';
import ApplicationForm from './ApplicationForm';

interface ApplicationProps {
  applicationId?: string;
}

const Application: React.FC<ApplicationProps> = ({ applicationId }) => {
  if (!applicationId) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-destructive">ID заявки не указан</div>
      </div>
    );
  }

  return <ApplicationForm applicationId={applicationId} />;
};

export default Application;

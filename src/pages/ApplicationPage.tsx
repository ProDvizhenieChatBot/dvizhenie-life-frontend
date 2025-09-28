import React from 'react';
import { useParams } from 'react-router-dom';
import Application from '../components/Application';

const ApplicationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return <Application applicationId={id} />;
};

export default ApplicationPage;

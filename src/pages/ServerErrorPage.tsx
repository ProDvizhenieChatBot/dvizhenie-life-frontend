import React from 'react';
import Error from '../components/Error';

const ServerErrorPage: React.FC = () => {
  return (
    <div>
      <Error
        title="500 - Внутренняя ошибка сервера"
        message="Произошла ошибка на сервере. Пожалуйста, попробуйте позже."
        showBackButton={true}
      />
    </div>
  );
};

export default ServerErrorPage;

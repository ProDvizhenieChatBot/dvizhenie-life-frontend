import React from 'react';
import Error from '../components/Error';

const NotFoundPage: React.FC = () => {
  return (
    <div>
      <Error
        title="404 - Страница не найдена"
        message="Извините, запрашиваемая страница не существует."
        showBackButton={true}
      />
    </div>
  );
};

export default NotFoundPage;

import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

interface Application {
  id: string;
  name: string;
  age: number;
  status: 'completed' | 'in_progress' | 'pending';
  createdAt: string;
}

const ApplicationList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Моковые данные для демонстрации
  const applications: Application[] = useMemo(
    () => [
      { id: '1', name: 'Иван Петров', age: 25, status: 'completed', createdAt: '2024-01-15' },
      { id: '2', name: 'Мария Сидорова', age: 30, status: 'in_progress', createdAt: '2024-01-16' },
      { id: '3', name: 'Алексей Козлов', age: 28, status: 'pending', createdAt: '2024-01-17' },
      { id: '4', name: 'Елена Волкова', age: 32, status: 'completed', createdAt: '2024-01-18' },
      { id: '5', name: 'Дмитрий Соколов', age: 27, status: 'in_progress', createdAt: '2024-01-19' },
    ],
    [],
  );

  const handleCardClick = (applicationId: string) => {
    navigate(`/application/${applicationId}`);
  };

  // Фильтрация и поиск
  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const matchesSearch = application.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === null || application.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, selectedStatus]);

  const handleStatusFilter = (status: string | null) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'pending':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершена';
      case 'in_progress':
        return 'В процессе';
      case 'pending':
        return 'Ожидает';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Список анкет</h2>
          <p className="text-muted-foreground">
            Показано: {filteredApplications.length} из {applications.length}
          </p>
        </div>
      </div>

      {/* Поиск и фильтры */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Поиск по имени..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={selectedStatus === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusFilter(null)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Все
          </Button>
          <Button
            variant={selectedStatus === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusFilter('completed')}
          >
            Завершены
          </Button>
          <Button
            variant={selectedStatus === 'in_progress' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusFilter('in_progress')}
          >
            В процессе
          </Button>
          <Button
            variant={selectedStatus === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusFilter('pending')}
          >
            Ожидают
          </Button>
        </div>
      </div>

      <div className="grid gap-3">
        {filteredApplications.map((application) => (
          <Card
            key={application.id}
            className="cursor-pointer hover:shadow-md transition-shadow duration-200"
            onClick={() => handleCardClick(application.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{application.name}</h3>
                  <p className="text-sm text-muted-foreground">Создана: {application.createdAt}</p>
                </div>
                <Badge variant={getStatusVariant(application.status)}>
                  {getStatusText(application.status)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApplicationList;

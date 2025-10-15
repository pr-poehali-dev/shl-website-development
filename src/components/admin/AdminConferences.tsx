import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Conference {
  id: number;
  name: string;
}

const AdminConferences = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [editingConference, setEditingConference] = useState<Conference | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchConferences();
  }, []);

  const fetchConferences = async () => {
    try {
      const data = await api.getConferences();
      setConferences(data.conferences || []);
    } catch (error) {
      console.error('Ошибка загрузки конференций:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingConference) return;

    try {
      await api.updateConference(editingConference);
      toast({
        title: 'Успешно!',
        description: 'Конференция обновлена',
      });
      fetchConferences();
      setEditingConference(null);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить конференцию',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {editingConference && (
        <Card className="bg-primary/10 border-primary">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-4 gradient-text">Редактирование конференции</h3>
            <div>
              <Label>Название конференции</Label>
              <Input
                value={editingConference.name}
                onChange={(e) => setEditingConference({ ...editingConference, name: e.target.value })}
                className="bg-background"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleUpdate} className="gradient-blue-red">
                <Icon name="Check" size={20} className="mr-2" />
                Сохранить
              </Button>
              <Button onClick={() => setEditingConference(null)} variant="outline">
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {conferences.map((conference) => (
          <Card key={conference.id} className="bg-muted/30 border-primary/20 hover:border-primary/40 transition-all">
            <CardContent className="py-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-lg">{conference.name}</h4>
              </div>
              <Button
                onClick={() => setEditingConference(conference)}
                variant="ghost"
                size="icon"
                className="hover:bg-primary/20"
              >
                <Icon name="Pencil" size={20} />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminConferences;

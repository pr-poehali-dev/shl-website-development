import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Regulation {
  id?: number;
  title: string;
  content: string;
  order_index: number;
}

const AdminRegulations = () => {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [editingRegulation, setEditingRegulation] = useState<Regulation | null>(null);
  const [newRegulation, setNewRegulation] = useState<Regulation>({
    title: '',
    content: '',
    order_index: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchRegulations();
  }, []);

  const fetchRegulations = async () => {
    try {
      const data = await api.getAdminRegulations();
      setRegulations(data.regulations || []);
    } catch (error) {
      console.error('Ошибка загрузки регламента:', error);
    }
  };

  const handleAdd = async () => {
    if (!newRegulation.title || !newRegulation.content) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.addRegulation(newRegulation);
      toast({
        title: 'Успешно!',
        description: 'Пункт регламента добавлен',
      });
      fetchRegulations();
      setNewRegulation({ title: '', content: '', order_index: 0 });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить пункт',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingRegulation) return;

    try {
      await api.updateRegulation(editingRegulation);
      toast({
        title: 'Успешно!',
        description: 'Регламент обновлен',
      });
      fetchRegulations();
      setEditingRegulation(null);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить регламент',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/10 border-primary">
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold mb-4 gradient-text">
            {editingRegulation ? 'Редактировать пункт' : 'Добавить пункт'}
          </h3>
          <div className="space-y-4">
            <div>
              <Label>Заголовок</Label>
              <Input
                value={editingRegulation ? editingRegulation.title : newRegulation.title}
                onChange={(e) =>
                  editingRegulation
                    ? setEditingRegulation({ ...editingRegulation, title: e.target.value })
                    : setNewRegulation({ ...newRegulation, title: e.target.value })
                }
                className="bg-background"
              />
            </div>
            <div>
              <Label>Содержание</Label>
              <Textarea
                value={editingRegulation ? editingRegulation.content : newRegulation.content}
                onChange={(e) =>
                  editingRegulation
                    ? setEditingRegulation({ ...editingRegulation, content: e.target.value })
                    : setNewRegulation({ ...newRegulation, content: e.target.value })
                }
                className="bg-background min-h-32"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            {editingRegulation ? (
              <>
                <Button onClick={handleUpdate} className="gradient-blue-red">
                  <Icon name="Check" size={20} className="mr-2" />
                  Сохранить
                </Button>
                <Button onClick={() => setEditingRegulation(null)} variant="outline">
                  Отмена
                </Button>
              </>
            ) : (
              <Button onClick={handleAdd} className="gradient-blue-red">
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить пункт
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {regulations.map((regulation) => (
          <Card key={regulation.id} className="bg-muted/30 border-primary/20 hover:border-primary/40 transition-all">
            <CardContent className="py-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-2">{regulation.title}</h4>
                <p className="text-sm text-muted-foreground">{regulation.content}</p>
              </div>
              <Button
                onClick={() => setEditingRegulation(regulation)}
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

export default AdminRegulations;
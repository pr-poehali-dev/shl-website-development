import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Team {
  id: number;
  name: string;
  games_played: number;
  wins: number;
  losses: number;
  overtime_losses: number;
  points: number;
  goals_for: number;
  goals_against: number;
  conference_id: number;
}

const AdminTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const data = await api.getTeams();
      setTeams(data.teams || []);
    } catch (error) {
      console.error('Ошибка загрузки команд:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingTeam) return;

    try {
      await api.updateTeam(editingTeam);
      toast({
        title: 'Успешно!',
        description: 'Команда обновлена',
      });
      fetchTeams();
      setEditingTeam(null);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить команду',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {editingTeam && (
        <Card className="bg-primary/10 border-primary">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-4 gradient-text">Редактирование команды</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Название</Label>
                <Input
                  value={editingTeam.name}
                  onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                  className="bg-background"
                />
              </div>
              <div>
                <Label>Игры</Label>
                <Input
                  type="number"
                  value={editingTeam.games_played}
                  onChange={(e) => setEditingTeam({ ...editingTeam, games_played: parseInt(e.target.value) || 0 })}
                  className="bg-background"
                />
              </div>
              <div>
                <Label>Победы</Label>
                <Input
                  type="number"
                  value={editingTeam.wins}
                  onChange={(e) => setEditingTeam({ ...editingTeam, wins: parseInt(e.target.value) || 0 })}
                  className="bg-background"
                />
              </div>
              <div>
                <Label>Поражения</Label>
                <Input
                  type="number"
                  value={editingTeam.losses}
                  onChange={(e) => setEditingTeam({ ...editingTeam, losses: parseInt(e.target.value) || 0 })}
                  className="bg-background"
                />
              </div>
              <div>
                <Label>Поражения ОТ</Label>
                <Input
                  type="number"
                  value={editingTeam.overtime_losses}
                  onChange={(e) => setEditingTeam({ ...editingTeam, overtime_losses: parseInt(e.target.value) || 0 })}
                  className="bg-background"
                />
              </div>
              <div>
                <Label>Очки</Label>
                <Input
                  type="number"
                  value={editingTeam.points}
                  onChange={(e) => setEditingTeam({ ...editingTeam, points: parseInt(e.target.value) || 0 })}
                  className="bg-background"
                />
              </div>
              <div>
                <Label>Шайбы забито</Label>
                <Input
                  type="number"
                  value={editingTeam.goals_for}
                  onChange={(e) => setEditingTeam({ ...editingTeam, goals_for: parseInt(e.target.value) || 0 })}
                  className="bg-background"
                />
              </div>
              <div>
                <Label>Шайбы пропущено</Label>
                <Input
                  type="number"
                  value={editingTeam.goals_against}
                  onChange={(e) => setEditingTeam({ ...editingTeam, goals_against: parseInt(e.target.value) || 0 })}
                  className="bg-background"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleUpdate} className="gradient-blue-red">
                <Icon name="Check" size={20} className="mr-2" />
                Сохранить
              </Button>
              <Button onClick={() => setEditingTeam(null)} variant="outline">
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {teams.map((team) => (
          <Card key={team.id} className="bg-muted/30 border-primary/20 hover:border-primary/40 transition-all">
            <CardContent className="py-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-lg">{team.name}</h4>
                <p className="text-sm text-muted-foreground">
                  И: {team.games_played} | В: {team.wins} | П: {team.losses} | ПО: {team.overtime_losses} | О: {team.points}
                </p>
              </div>
              <Button
                onClick={() => setEditingTeam(team)}
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

export default AdminTeams;
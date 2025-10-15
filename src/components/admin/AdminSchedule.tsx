import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Match {
  id?: number;
  home_team_id: number;
  away_team_id: number;
  match_date: string;
  home_score: number | null;
  away_score: number | null;
  status: string;
}

interface Team {
  id: number;
  name: string;
}

const AdminSchedule = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [newMatch, setNewMatch] = useState<Match>({
    home_team_id: 0,
    away_team_id: 0,
    match_date: '',
    home_score: null,
    away_score: null,
    status: 'scheduled',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, []);

  const fetchMatches = async () => {
    try {
      const data = await api.getMatches();
      setMatches(data.matches || []);
    } catch (error) {
      console.error('Ошибка загрузки матчей:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const data = await api.getTeams();
      setTeams(data.teams || []);
    } catch (error) {
      console.error('Ошибка загрузки команд:', error);
    }
  };

  const handleAddMatch = async () => {
    if (!newMatch.home_team_id || !newMatch.away_team_id || !newMatch.match_date) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.addMatch(newMatch);
      toast({
        title: 'Успешно!',
        description: 'Матч добавлен',
      });
      fetchMatches();
      setNewMatch({
        home_team_id: 0,
        away_team_id: 0,
        match_date: '',
        home_score: null,
        away_score: null,
        status: 'scheduled',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить матч',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/10 border-primary">
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold mb-4 gradient-text">Добавить матч</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Команда хозяев</Label>
              <Select
                value={newMatch.home_team_id.toString()}
                onValueChange={(value) => setNewMatch({ ...newMatch, home_team_id: parseInt(value) })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Выберите команду" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Команда гостей</Label>
              <Select
                value={newMatch.away_team_id.toString()}
                onValueChange={(value) => setNewMatch({ ...newMatch, away_team_id: parseInt(value) })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Выберите команду" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Дата и время</Label>
              <Input
                type="datetime-local"
                value={newMatch.match_date}
                onChange={(e) => setNewMatch({ ...newMatch, match_date: e.target.value })}
                className="bg-background"
              />
            </div>
            <div>
              <Label>Статус</Label>
              <Select
                value={newMatch.status}
                onValueChange={(value) => setNewMatch({ ...newMatch, status: value })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Запланирован</SelectItem>
                  <SelectItem value="finished">Завершен</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddMatch} className="gradient-blue-red mt-4">
            <Icon name="Plus" size={20} className="mr-2" />
            Добавить матч
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {matches.map((match: any) => (
          <Card key={match.id} className="bg-muted/30 border-primary/20">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">
                  {match.home_team} vs {match.away_team}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(match.match_date).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminSchedule;
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
  position: number;
}

interface Conference {
  id: number;
  name: string;
  teams: Team[];
}

const StandingsTab = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStandings();
  }, []);

  const fetchStandings = async () => {
    try {
      const data = await api.getStandings();
      setConferences(data.conferences || []);
    } catch (error) {
      console.error('Ошибка загрузки таблицы:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Загрузка...</div>;
  }

  return (
    <div className="space-y-8">
      {conferences.map((conference, idx) => (
        <Card 
          key={conference.id} 
          className="bg-muted/30 border-primary/20 hover:border-primary/40 transition-all duration-300"
          style={{ animationDelay: `${idx * 0.1}s` }}
        >
          <CardHeader className="gradient-blue-red">
            <CardTitle className="text-2xl font-bold text-white text-center">
              {conference.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow className="border-primary/20">
                  <TableHead className="text-accent font-bold">#</TableHead>
                  <TableHead className="text-accent font-bold">Команда</TableHead>
                  <TableHead className="text-center text-accent font-bold">И</TableHead>
                  <TableHead className="text-center text-accent font-bold">В</TableHead>
                  <TableHead className="text-center text-accent font-bold">П</TableHead>
                  <TableHead className="text-center text-accent font-bold">О</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conference.teams.map((team) => (
                  <TableRow 
                    key={team.id}
                    className="hover:bg-primary/10 transition-colors duration-200 border-border/50"
                  >
                    <TableCell className="font-bold text-primary">{team.position}</TableCell>
                    <TableCell className="font-semibold">{team.name}</TableCell>
                    <TableCell className="text-center">{team.games_played}</TableCell>
                    <TableCell className="text-center text-green-400">{team.wins}</TableCell>
                    <TableCell className="text-center text-red-400">{team.losses}</TableCell>
                    <TableCell className="text-center font-bold text-accent">{team.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StandingsTab;
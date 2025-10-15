import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Match {
  id: number;
  home_team: string;
  away_team: string;
  match_date: string;
  home_score: number | null;
  away_score: number | null;
  status: string;
}

const ScheduleTab = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const data = await api.getSchedule();
      setMatches(data.matches || []);
    } catch (error) {
      console.error('Ошибка загрузки расписания:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Загрузка...</div>;
  }

  if (matches.length === 0) {
    return (
      <Card className="bg-muted/30 border-primary/20">
        <CardContent className="py-12 text-center">
          <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl text-muted-foreground">Матчи пока не запланированы</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match, idx) => (
        <Card 
          key={match.id} 
          className="bg-muted/30 border-primary/20 hover:border-primary/40 hover:card-glow transition-all duration-300"
          style={{ animationDelay: `${idx * 0.05}s` }}
        >
          <CardContent className="py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 text-right">
                <p className="text-xl font-bold">{match.home_team}</p>
                {match.status === 'finished' && (
                  <p className="text-3xl font-black text-accent mt-2">{match.home_score}</p>
                )}
              </div>

              <div className="text-center px-6">
                <div className="w-12 h-12 rounded-full gradient-blue-red flex items-center justify-center mb-2">
                  <Icon name="Swords" size={24} className="text-white" />
                </div>
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                  {formatDate(match.match_date)}
                </p>
                {match.status === 'scheduled' && (
                  <p className="text-xs text-accent mt-1 font-semibold">Запланирован</p>
                )}
                {match.status === 'finished' && (
                  <p className="text-xs text-green-400 mt-1 font-semibold">Завершен</p>
                )}
              </div>

              <div className="flex-1 text-left">
                <p className="text-xl font-bold">{match.away_team}</p>
                {match.status === 'finished' && (
                  <p className="text-3xl font-black text-accent mt-2">{match.away_score}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScheduleTab;
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Regulation {
  id: number;
  title: string;
  content: string;
  order_index: number;
}

const RegulationsTab = () => {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegulations();
  }, []);

  const fetchRegulations = async () => {
    try {
      const data = await api.getRegulations();
      setRegulations(data.regulations || []);
    } catch (error) {
      console.error('Ошибка загрузки регламента:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      {regulations.map((regulation, idx) => (
        <Card 
          key={regulation.id}
          className="bg-muted/30 border-primary/20 hover:border-primary/40 transition-all duration-300"
          style={{ animationDelay: `${idx * 0.1}s` }}
        >
          <CardContent className="py-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full gradient-blue-red flex items-center justify-center">
                  <Icon name="FileText" size={24} className="text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 gradient-text">{regulation.title}</h3>
                <p className="text-foreground/90 leading-relaxed">{regulation.content}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RegulationsTab;
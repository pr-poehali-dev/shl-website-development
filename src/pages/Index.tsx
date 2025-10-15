import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import StandingsTab from '@/components/StandingsTab';
import ScheduleTab from '@/components/ScheduleTab';
import RegulationsTab from '@/components/RegulationsTab';
import AdminPanel from '@/components/AdminPanel';

const Index = () => {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Icon name="Trophy" size={48} className="text-accent" />
            <h1 className="text-6xl font-black gradient-text">СХЛ</h1>
            <Icon name="Trophy" size={48} className="text-accent" />
          </div>
          <p className="text-xl text-muted-foreground">Студенческая Хоккейная Лига</p>
          
          <Button
            onClick={() => setShowAdmin(!showAdmin)}
            variant="outline"
            className="mt-6 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300"
          >
            <Icon name="Settings" size={20} className="mr-2" />
            Админ-панель
          </Button>
        </header>

        {showAdmin ? (
          <AdminPanel onClose={() => setShowAdmin(false)} />
        ) : (
          <Card className="bg-card/80 backdrop-blur-sm border-border card-glow animate-fade-in">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Турнирная информация</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="standings" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50">
                  <TabsTrigger 
                    value="standings"
                    className="data-[state=active]:gradient-blue-red data-[state=active]:text-white transition-all duration-300"
                  >
                    <Icon name="Table" size={20} className="mr-2" />
                    Таблица
                  </TabsTrigger>
                  <TabsTrigger 
                    value="schedule"
                    className="data-[state=active]:gradient-blue-red data-[state=active]:text-white transition-all duration-300"
                  >
                    <Icon name="Calendar" size={20} className="mr-2" />
                    Расписание
                  </TabsTrigger>
                  <TabsTrigger 
                    value="regulations"
                    className="data-[state=active]:gradient-blue-red data-[state=active]:text-white transition-all duration-300"
                  >
                    <Icon name="FileText" size={20} className="mr-2" />
                    Регламент
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="standings" className="space-y-6">
                  <StandingsTab />
                </TabsContent>

                <TabsContent value="schedule" className="space-y-6">
                  <ScheduleTab />
                </TabsContent>

                <TabsContent value="regulations" className="space-y-6">
                  <RegulationsTab />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;

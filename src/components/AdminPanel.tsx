import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import AdminTeams from '@/components/admin/AdminTeams';
import AdminSchedule from '@/components/admin/AdminSchedule';
import AdminRegulations from '@/components/admin/AdminRegulations';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border card-glow animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-3xl font-bold gradient-text">Админ-панель</CardTitle>
          <Button 
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="hover:bg-destructive/20"
          >
            <Icon name="X" size={24} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50">
            <TabsTrigger 
              value="teams"
              className="data-[state=active]:gradient-blue-red data-[state=active]:text-white"
            >
              <Icon name="Users" size={20} className="mr-2" />
              Команды
            </TabsTrigger>
            <TabsTrigger 
              value="schedule"
              className="data-[state=active]:gradient-blue-red data-[state=active]:text-white"
            >
              <Icon name="Calendar" size={20} className="mr-2" />
              Расписание
            </TabsTrigger>
            <TabsTrigger 
              value="regulations"
              className="data-[state=active]:gradient-blue-red data-[state=active]:text-white"
            >
              <Icon name="FileText" size={20} className="mr-2" />
              Регламент
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teams">
            <AdminTeams />
          </TabsContent>

          <TabsContent value="schedule">
            <AdminSchedule />
          </TabsContent>

          <TabsContent value="regulations">
            <AdminRegulations />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminPanel;

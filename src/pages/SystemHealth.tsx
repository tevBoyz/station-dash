import { useStationStore } from '../lib/store';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Zap,
  Thermometer,
  Activity,
  Clock,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function SystemHealth() {
  const { notifications } = useStationStore();

  const systemMetrics = [
    { label: 'Uptime', value: '99.7%', status: 'healthy', icon: Clock },
    { label: 'Power Load', value: '78%', status: 'healthy', icon: Zap },
    { label: 'Temperature', value: '34°C', status: 'healthy', icon: Thermometer },
    { label: 'Network', value: 'Connected', status: 'healthy', icon: Activity },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-status-available" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-status-reserved" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-status-faulty" />;
      default:
        return <Info className="w-4 h-4 text-status-charging" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">System Health</h1>
        <p className="text-muted-foreground">Monitor station status and activity feed</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6 gradient-card border-border/40">
            <h3 className="text-lg font-semibold mb-4">System Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {systemMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <metric.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className="text-lg font-semibold">{metric.value}</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-status-available" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 gradient-card border-border/40">
            <h3 className="text-lg font-semibold mb-4">Power Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Grid Power</span>
                  <span className="font-medium">850 kW / 1200 kW</span>
                </div>
                <Progress value={71} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Battery Backup</span>
                  <span className="font-medium">95%</span>
                </div>
                <Progress value={95} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Solar Input</span>
                  <span className="font-medium">180 kW / 300 kW</span>
                </div>
                <Progress value={60} className="h-3" />
              </div>
            </div>
          </Card>
        </div>

        {/* Notifications Feed */}
        <Card className="p-6 gradient-card border-border/40 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Activity Feed</h3>
          <ScrollArea className="flex-1 h-[500px] pr-4">
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No recent activity
                </p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                  >
                    {getNotificationIcon(notif.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(notif.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}

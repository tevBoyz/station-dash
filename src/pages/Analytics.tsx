import { useMemo } from 'react';
import { useStationStore } from '../lib/store';
import { Card } from '../components/ui/card';
import { KPICard } from '../components/station/KPICard';
import { Button } from '../components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Zap, DollarSign, Clock, TrendingUp } from 'lucide-react';

export default function Analytics() {
  const { totalRevenue, totalEnergyDispensed, slots } = useStationStore();

  // Generate mock data for charts
  const utilizationData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      utilization: Math.floor(Math.random() * 40) + 50,
    }));
  }, []);

  const energyData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      energy: Math.floor(Math.random() * 300) + 200,
    }));
  }, []);

  const avgChargingTime = useMemo(() => {
    const chargingSessions = slots.filter((s) => s.sessionStart);
    if (chargingSessions.length === 0) return 0;
    const totalMinutes = chargingSessions.reduce((sum, slot) => {
      if (!slot.sessionStart) return sum;
      return sum + (Date.now() - slot.sessionStart.getTime()) / 60000;
    }, 0);
    return Math.floor(totalMinutes / chargingSessions.length);
  }, [slots]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">Performance metrics and trends</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Today</Button>
          <Button variant="outline">Week</Button>
          <Button variant="outline">Month</Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          trend={{ value: '18%', isPositive: true }}
        />
        <KPICard
          title="Energy Dispensed"
          value={`${totalEnergyDispensed.toFixed(1)} kWh`}
          icon={Zap}
          trend={{ value: '12%', isPositive: true }}
        />
        <KPICard
          title="Avg Charging Time"
          value={`${avgChargingTime} min`}
          icon={Clock}
        />
        <KPICard
          title="Revenue/Session"
          value={`$${totalRevenue > 0 ? (totalRevenue / Math.max(1, slots.filter((s) => s.truck).length)).toFixed(2) : '0.00'}`}
          icon={TrendingUp}
          trend={{ value: '8%', isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilization Chart */}
        <Card className="p-6 gradient-card border-border/40">
          <h3 className="text-lg font-semibold mb-4">Slot Utilization (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={utilizationData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 12 }}
                interval={3}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="utilization"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Energy Dispensed Chart */}
        <Card className="p-6 gradient-card border-border/40">
          <h3 className="text-lg font-semibold mb-4">Energy Dispensed (kWh)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 12 }}
                interval={3}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar
                dataKey="energy"
                fill="hsl(var(--accent))"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Additional Metrics */}
      <Card className="p-6 gradient-card border-border/40">
        <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Peak Hour</p>
            <p className="text-2xl font-bold">14:00 - 15:00</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Sessions Today</p>
            <p className="text-2xl font-bold">{slots.filter((s) => s.truck).length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Average Wait Time</p>
            <p className="text-2xl font-bold">3.2 min</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

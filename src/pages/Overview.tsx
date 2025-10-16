import { useEffect } from 'react';
import { useStationStore } from '../lib/store';
import { KPICard } from '../components/station/KPICard';
import { SlotCard } from '../components/station/SlotCard';
import { Button } from '../components/ui/button';
import { Zap, Activity, Clock, TrendingUp, Truck } from 'lucide-react';
import { PaymentModal } from '../components/station/PaymentModal';

export default function Overview() {
  const {
    slots,
    queue,
    simulateTruckArrival,
    updateChargingProgress,
    startCharging,
    endCharging,
    processPayment,
  } = useStationStore();

  const activeSlots = slots.filter((s) => s.status === 'charging').length;
  const utilization = ((slots.filter((s) => s.status !== 'available').length / slots.length) * 100).toFixed(0);

  // Simulation intervals
  useEffect(() => {
    // Update charging progress every 2 seconds
    const chargingInterval = setInterval(() => {
      updateChargingProgress();
    }, 2000);

    // Random truck arrivals every 20-35 seconds
    const arrivalInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        simulateTruckArrival();
      }
    }, Math.random() * 15000 + 20000);

    return () => {
      clearInterval(chargingInterval);
      clearInterval(arrivalInterval);
    };
  }, []);

  const paymentSlot = slots.find((s) => s.status === 'payment');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Station Overview</h1>
          <p className="text-muted-foreground">Real-time monitoring of Adama Highway Hub</p>
        </div>
        <Button onClick={simulateTruckArrival} size="lg" className="gradient-primary">
          <Truck className="w-4 h-4 mr-2" />
          Simulate Truck Arrival
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Slots"
          value={slots.length}
          icon={Zap}
        />
        <KPICard
          title="Active Sessions"
          value={activeSlots}
          icon={Activity}
          trend={{ value: '12%', isPositive: true }}
        />
        <KPICard
          title="Queued Trucks"
          value={queue.length}
          icon={Clock}
        />
        <KPICard
          title="Utilization"
          value={`${utilization}%`}
          icon={TrendingUp}
          trend={{ value: '5%', isPositive: true }}
        />
      </div>

      {/* Live Slots Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4">Live Slot Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {slots.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              onStartSession={() => startCharging(slot.id)}
              onEndSession={() => endCharging(slot.id)}
              onProcessPayment={() => processPayment(slot.id)}
            />
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {paymentSlot && (
        <PaymentModal
          slot={paymentSlot}
          onClose={() => {}}
          onPaymentComplete={() => processPayment(paymentSlot.id)}
        />
      )}
    </div>
  );
}

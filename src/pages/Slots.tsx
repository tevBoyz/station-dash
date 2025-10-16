import { useStationStore } from '../lib/store';
import { SlotCard } from '../components/station/SlotCard';
import { PaymentModal } from '../components/station/PaymentModal';
import { Badge } from '../components/ui/badge';

export default function Slots() {
  const { slots, startCharging, endCharging, processPayment } = useStationStore();

  const statusCounts = {
    available: slots.filter((s) => s.status === 'available').length,
    charging: slots.filter((s) => s.status === 'charging').length,
    reserved: slots.filter((s) => s.status === 'reserved').length,
    payment: slots.filter((s) => s.status === 'payment').length,
    faulty: slots.filter((s) => s.status === 'faulty').length,
  };

  const paymentSlot = slots.find((s) => s.status === 'payment');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Slot Control Panel</h1>
        <p className="text-muted-foreground">Manage all 10 charging bays</p>
      </div>

      {/* Status Summary */}
      <div className="flex flex-wrap gap-3">
        <Badge className="bg-status-available px-4 py-2">
          Available: {statusCounts.available}
        </Badge>
        <Badge className="bg-status-charging px-4 py-2">
          Charging: {statusCounts.charging}
        </Badge>
        <Badge className="bg-status-reserved px-4 py-2">
          Reserved: {statusCounts.reserved}
        </Badge>
        <Badge className="bg-status-payment px-4 py-2">
          Payment: {statusCounts.payment}
        </Badge>
        <Badge className="bg-status-faulty px-4 py-2">
          Faulty: {statusCounts.faulty}
        </Badge>
      </div>

      {/* Slots Grid */}
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

import type { Slot, SlotStatus } from '../../lib/store';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Zap, Clock, Battery, AlertTriangle, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SlotCardProps {
  slot: Slot;
  onStartSession?: () => void;
  onEndSession?: () => void;
  onProcessPayment?: () => void;
}

const statusConfig: Record<SlotStatus, { label: string; color: string; bgColor: string }> = {
  available: { label: 'Available', color: 'text-status-available', bgColor: 'status-available' },
  charging: { label: 'Charging', color: 'text-status-charging', bgColor: 'status-charging' },
  reserved: { label: 'Reserved', color: 'text-status-reserved', bgColor: 'status-reserved' },
  faulty: { label: 'Faulty', color: 'text-status-faulty', bgColor: 'status-faulty' },
  payment: { label: 'Awaiting Payment', color: 'text-status-payment', bgColor: 'status-payment' },
};

export function SlotCard({ slot, onStartSession, onEndSession, onProcessPayment }: SlotCardProps) {
  const config = statusConfig[slot.status];
  const progress = slot.targetEnergy > 0 ? (slot.energyUsed / slot.targetEnergy) * 100 : 0;

  return (
    <Card className="p-4 gradient-card border-border/40 hover:shadow-lg transition-all group">
      {/* Header */}
      <div className="flex flex-col items-center justify-between gap-5 mb-3 w-full">
        <div className="w-full flex items-center justify-between gap-2">
          <div className="left flex items-center justify-center">
             <Zap className={`w-8 h-8 ${config.color} ${slot.status === 'charging' ? 'animate-charging' : ''}`} />
          <span className="font-i text-md">Slot </span>
          </div>
          <div className="right">
            <span className='font-bold text-4xl '>#{slot.id}</span>
          </div>
        </div>
        <div className={`p-3 w-full text-center font-bold rounded-full text-xs font-semibold ${config.bgColor} text-white`}>
          {config.label}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 min-h-[120px]">
        {slot.truck && (
          <>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Truck ID</p>
              <p className="font-semibold">{slot.truck.plate}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Driver</p>
              <p className="font-medium">{slot.truck.driver}</p>
            </div>
          </>
        )}

        {slot.status === 'charging' && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Battery className="w-4 h-4" />
                  Energy
                </span>
                <span className="font-semibold">
                  {slot.energyUsed.toFixed(1)} / {slot.targetEnergy} kWh
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            {slot.sessionStart && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                Started {formatDistanceToNow(slot.sessionStart, { addSuffix: true })}
              </div>
            )}
          </>
        )}

        {slot.status === 'payment' && (
          <div className="p-3 rounded-lg bg-status-payment/10 border border-status-payment/20">
            <div className="flex items-center gap-2 text-status-payment font-semibold mb-2">
              <DollarSign className="w-4 h-4" />
              Payment Required
            </div>
            <p className="text-sm">
              Energy: {slot.energyUsed.toFixed(1)} kWh
              <br />
              Total: ${((slot.energyUsed * 0.25) + 2.0).toFixed(2)}
            </p>
          </div>
        )}

        {slot.status === 'faulty' && (
          <div className="p-3 rounded-lg bg-status-faulty/10 border border-status-faulty/20 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-status-faulty" />
            <span className="text-sm text-status-faulty font-medium">Maintenance Required</span>
          </div>
        )}

        {slot.status === 'available' && (
          <p className="text-sm text-muted-foreground">Ready for next vehicle</p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {slot.status === 'available' && onStartSession && (
          <Button size="sm" className="w-full" onClick={onStartSession}>
            Start Session
          </Button>
        )}
        {slot.status === 'charging' && onEndSession && (
          <Button size="sm" variant="outline" className="w-full hover:text-white dark:[hover:bg-red]" onClick={onEndSession}>
            End Session
          </Button>
        )}
        {slot.status === 'payment' && onProcessPayment && (
          <Button size="sm" className="w-full gradient-accent" onClick={onProcessPayment}>
            Process Payment
          </Button>
        )}
      </div>
    </Card>
  );
}

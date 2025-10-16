import { useState } from 'react';
import type { Slot } from '../../lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { CheckCircle2, Send, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentModalProps {
  slot: Slot;
  onClose: () => void;
  onPaymentComplete: () => void;
}

export function PaymentModal({ slot, onClose, onPaymentComplete }: PaymentModalProps) {
  const [paymentSent, setPaymentSent] = useState(false);
  

  const energyCost = slot.energyUsed * 0.25;
  const idleFee = 2.0;
  const total = energyCost + idleFee;

  const handleSendNotification = () => {
    setPaymentSent(true);
    toast('Payment notification sent',{
      description: `Telebirr payment request sent to ${slot.truck?.driver}`,
    });
  };

  const handlePaymentReceived = () => {
    toast('Payment successful', {
      description: `$${total.toFixed(2)} received — Slot #${slot.id} now available`,
    });
    onPaymentComplete();
    onClose();
  };

  const handleRetry = () => {
    setPaymentSent(false);
    toast('Retrying payment', {
      description: 'Sending new payment notification',
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            Charging Complete
          </DialogTitle>
          <DialogDescription>
            Payment required for Slot #{slot.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Payment Details */}
          <div className="space-y-3 p-4 rounded-lg bg-muted/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Truck ID</span>
              <span className="font-semibold">{slot.truck?.plate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Driver</span>
              <span className="font-semibold">{slot.truck?.driver}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Slot</span>
              <span className="font-semibold">#{slot.id}</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Energy Used</span>
              <span className="font-medium">{slot.energyUsed.toFixed(1)} kWh</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rate</span>
              <span className="font-medium">$0.25 / kWh</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${energyCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Idle Fee</span>
              <span className="font-medium">$2.00</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between">
              <span className="font-semibold">Grand Total</span>
              <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Telebirr Payment Section */}
          <div className="p-4 rounded-lg border border-accent/20 bg-accent/5">
            <p className="text-sm font-medium mb-3">Payment via Telebirr</p>
            {!paymentSent ? (
              <p className="text-xs text-muted-foreground mb-4">
                Send a payment notification to the driver's Telebirr account
              </p>
            ) : (
              <div className="flex items-center gap-2 mb-4 p-2 rounded bg-accent/10">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <p className="text-xs text-accent font-medium">Payment notification sent</p>
              </div>
            )}

            <div className="flex gap-2">
              {!paymentSent ? (
                <Button
                  onClick={handleSendNotification}
                  className="flex-1 gradient-accent"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Payment Notification
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handlePaymentReceived}
                    className="flex-1 gradient-primary"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Confirm Payment Received
                  </Button>
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    size="icon"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

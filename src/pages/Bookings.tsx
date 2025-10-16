import { useStationStore } from '../lib/store';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { format } from 'date-fns';
import { Clock, CheckCircle2, XCircle, Activity } from 'lucide-react';

export default function Bookings() {
  const { queue, bookings, slots, assignSlot, removeFromQueue } = useStationStore();

  const activeBookings = bookings.filter((b) => b.status === 'active' && b.slotId !== null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Bookings & Queue</h1>
        <p className="text-muted-foreground">Manage active charging sessions and waiting trucks</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="active">
            Active Bookings ({activeBookings.length})
          </TabsTrigger>
          <TabsTrigger value="queue">
            Queue ({queue.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <Card className="gradient-card border-border/40">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Truck ID</TableHead>
                  <TableHead>Driver Name</TableHead>
                  <TableHead>Arrival Time</TableHead>
                  <TableHead>Assigned Slot</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No active bookings
                    </TableCell>
                  </TableRow>
                ) : (
                  activeBookings.map((booking) => {
                    const slot = slots.find((s) => s.id === booking.slotId);
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-semibold">
                          {booking.truck.plate}
                        </TableCell>
                        <TableCell>{booking.truck.driver}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(booking.truck.arrivalTime, 'h:mm a')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">#{booking.slotId}</Badge>
                        </TableCell>
                        <TableCell>
                          {slot && (
                            <Badge
                              className={
                                slot.status === 'charging'
                                  ? 'bg-status-charging'
                                  : slot.status === 'payment'
                                  ? 'bg-status-payment'
                                  : 'bg-status-reserved'
                              }
                            >
                              {slot.status === 'charging' ? (
                                <>
                                  <Activity className="w-3 h-3 mr-1" />
                                  Charging
                                </>
                              ) : slot.status === 'payment' ? (
                                'Payment'
                              ) : (
                                'Reserved'
                              )}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="mt-6">
          <Card className="gradient-card border-border/40">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Truck ID</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Arrival Time</TableHead>
                  <TableHead>Wait Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      <Clock className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      No trucks in queue
                    </TableCell>
                  </TableRow>
                ) : (
                  queue.map((truck) => {
                    const waitTime = Math.floor(
                      (Date.now() - truck.arrivalTime.getTime()) / 60000
                    );
                    const availableSlot = slots.find((s) => s.status === 'available');

                    return (
                      <TableRow key={truck.id}>
                        <TableCell className="font-semibold">
                          {truck.plate}
                        </TableCell>
                        <TableCell>{truck.driver}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(truck.arrivalTime, 'h:mm a')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            {waitTime} min
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => availableSlot && assignSlot(truck.id, availableSlot.id)}
                              disabled={!availableSlot}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Assign Slot
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromQueue(truck.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

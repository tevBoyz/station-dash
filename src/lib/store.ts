import { create } from 'zustand';

export type SlotStatus = 'available' | 'charging' | 'reserved' | 'faulty' | 'payment';

export interface Truck {
  id: string;
  plate: string;
  driver: string;
  arrivalTime: Date;
}

export interface Slot {
  id: number;
  status: SlotStatus;
  truck: Truck | null;
  energyUsed: number;
  sessionStart: Date | null;
  targetEnergy: number;
}

export interface Booking {
  id: string;
  truck: Truck;
  slotId: number | null;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface StationState {
  slots: Slot[];
  queue: Truck[];
  bookings: Booking[];
  notifications: Notification[];
  totalRevenue: number;
  totalEnergyDispensed: number;
  
  // Actions
  updateSlot: (id: number, updates: Partial<Slot>) => void;
  addToQueue: (truck: Truck) => void;
  removeFromQueue: (truckId: string) => void;
  assignSlot: (truckId: string, slotId: number) => void;
  startCharging: (slotId: number) => void;
  endCharging: (slotId: number) => void;
  processPayment: (slotId: number) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  simulateTruckArrival: () => void;
  updateChargingProgress: () => void;
}

// Generate mock truck data
const generateTruck = (): Truck => {
  const drivers = ['Bekele', 'Alazar', 'Meron', 'Dawit', 'Samuel', 'Tsion', 'Henok', 'Yared'];
  const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
  const randomPlate = `A2-${Math.floor(Math.random() * 900) + 100}`;
  
  return {
    id: `truck-${Date.now()}-${Math.random()}`,
    plate: randomPlate,
    driver: randomDriver,
    arrivalTime: new Date(),
  };
};

// Initialize slots
const initializeSlots = (): Slot[] => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    status: 'available' as SlotStatus,
    truck: null,
    energyUsed: 0,
    sessionStart: null,
    targetEnergy: 0,
  }));
};

export const useStationStore = create<StationState>((set, get) => ({
  slots: initializeSlots(),
  queue: [],
  bookings: [],
  notifications: [],
  totalRevenue: 0,
  totalEnergyDispensed: 0,

  updateSlot: (id, updates) => {
    set((state) => ({
      slots: state.slots.map((slot) =>
        slot.id === id ? { ...slot, ...updates } : slot
      ),
    }));
  },

  addToQueue: (truck) => {
    set((state) => {
      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        truck,
        slotId: null,
        status: 'active',
      };
      
      return {
        queue: [...state.queue, truck],
        bookings: [...state.bookings, newBooking],
      };
    });
    
    get().addNotification({
      message: `Truck ${truck.plate} arrived and joined queue`,
      type: 'info',
    });
  },

  removeFromQueue: (truckId) => {
    set((state) => ({
      queue: state.queue.filter((t) => t.id !== truckId),
    }));
  },

  assignSlot: (truckId, slotId) => {
    const { queue, updateSlot, removeFromQueue, addNotification } = get();
    const truck = queue.find((t) => t.id === truckId);
    
    if (!truck) return;
    
    updateSlot(slotId, {
      status: 'reserved',
      truck,
    });
    
    removeFromQueue(truckId);
    
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.truck.id === truckId ? { ...b, slotId, status: 'active' } : b
      ),
    }));
    
    addNotification({
      message: `Truck ${truck.plate} assigned to Slot #${slotId}`,
      type: 'success',
    });
    
    // Auto-start charging after 2 seconds
    setTimeout(() => {
      get().startCharging(slotId);
    }, 2000);
  },

  startCharging: (slotId) => {
    const slot = get().slots.find((s) => s.id === slotId);
    if (!slot || !slot.truck) return;
    
    const targetEnergy = Math.floor(Math.random() * 40) + 40; // 40-80 kWh
    
    get().updateSlot(slotId, {
      status: 'charging',
      sessionStart: new Date(),
      targetEnergy,
      energyUsed: 0,
    });
    
    get().addNotification({
      message: `Charging started for Truck ${slot.truck.plate} at Slot #${slotId}`,
      type: 'success',
    });
  },

  endCharging: (slotId) => {
    const slot = get().slots.find((s) => s.id === slotId);
    if (!slot || !slot.truck) return;
    
    get().updateSlot(slotId, {
      status: 'payment',
    });
    
    get().addNotification({
      message: `Charging completed for Truck ${slot.truck.plate} — Payment required`,
      type: 'warning',
    });
  },

  processPayment: (slotId) => {
    const slot = get().slots.find((s) => s.id === slotId);
    if (!slot || !slot.truck) return;
    
    const revenue = slot.energyUsed * 0.25 + 2.0; // $0.25/kWh + $2 idle fee
    
    set((state) => ({
      totalRevenue: state.totalRevenue + revenue,
      totalEnergyDispensed: state.totalEnergyDispensed + slot.energyUsed,
      bookings: state.bookings.map((b) =>
        b.slotId === slotId ? { ...b, status: 'completed' } : b
      ),
    }));
    
    get().updateSlot(slotId, {
      status: 'available',
      truck: null,
      energyUsed: 0,
      sessionStart: null,
      targetEnergy: 0,
    });
    
    get().addNotification({
      message: `Payment received from Truck ${slot.truck.plate} — Slot #${slotId} now available`,
      type: 'success',
    });
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [
        {
          id: `notif-${Date.now()}`,
          timestamp: new Date(),
          ...notification,
        },
        ...state.notifications,
      ].slice(0, 50), // Keep last 50 notifications
    }));
  },

  simulateTruckArrival: () => {
    const truck = generateTruck();
    get().addToQueue(truck);
    
    // Auto-assign to available slot if exists
    setTimeout(() => {
      const availableSlot = get().slots.find((s) => s.status === 'available');
      if (availableSlot) {
        get().assignSlot(truck.id, availableSlot.id);
      }
    }, 1000);
  },

  updateChargingProgress: () => {
    const { slots, updateSlot, endCharging } = get();
    
    slots.forEach((slot) => {
      if (slot.status === 'charging' && slot.truck) {
        const increment = Math.random() * 2 + 0.5; // 0.5-2.5 kWh per update
        const newEnergy = Math.min(slot.energyUsed + increment, slot.targetEnergy);
        
        updateSlot(slot.id, {
          energyUsed: newEnergy,
        });
        
        // Check if charging complete
        if (newEnergy >= slot.targetEnergy) {
          endCharging(slot.id);
        }
      }
    });
  },
}));

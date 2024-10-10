// Tipagem para o modelo User
export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  isAdmin: boolean;
  image: string | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Tipagem para o modelo Barbershop
export interface Barbershop {
  id: string;
  name: string;
  address: string;
  phones: string[];
  isClosed: boolean;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipagem para o modelo BarbershopService
export interface BarbershopService {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number; // Usando number para Decimal
  barbershopId: string;
  barbershop: Barbershop;
}

// Tipagem para o modelo Booking
export interface Booking {
  id: string;
  userId: string;
  user: User;
  serviceId: string;
  service: BarbershopService;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Tipagem para o resultado da query getTodayBookings
export interface TodayBooking {
  id: string;
  date: string; // Usamos string aqui porque a data será serializada
  user: {
    name: string | null;
  };
  service: {
    name: string;
    price: number;
    barbershop: {
      name: string;
    };
  };
}

// Tipagem para as props do componente BookingItem
export interface BookingItemProps {
  booking: TodayBooking;
}

// Tipagem para TimeSlot, caso seja necessário
export interface TimeSlot {
  id: string;
  time: string;
  barbershopId: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
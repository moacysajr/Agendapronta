'use server'

import { prisma } from '../_lib/prisma'

export async function checkScheduledServices(timeSlotId: string): Promise<string[]> {
  const timeSlot = await prisma.timeSlot.findUnique({
    where: { id: timeSlotId },
    include: {
      barbershop: {
        include: {
          services: {
            include: {
              bookings: {
                where: {
                  date: {
                    gte: new Date(),
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!timeSlot) return [];

  const scheduledServices: string[] = [];

  timeSlot.barbershop.services.forEach(service => {
    service.bookings.forEach(booking => {
      if (booking.date.toTimeString().startsWith(timeSlot.time)) {
        scheduledServices.push(`${service.name} - ${booking.date.toLocaleString()}`);
      }
    });
  });

  return scheduledServices;
}

export async function deleteTimeSlot(id: string) {
  await prisma.timeSlot.delete({ where: { id } });
}

export async function updateTimeSlotAvailability(id: string, isAvailable: boolean) {
  await prisma.timeSlot.update({ 
    where: { id }, 
    data: { isAvailable } 
  });
}

export async function addTimeSlot(barbershopId: string, time: string) {
  await prisma.timeSlot.create({
    data: {
      barbershopId,
      time,
      isAvailable: true
    }
  });
}

export async function getAllTimeSlots(barbershopId: string) {
  return prisma.timeSlot.findMany({
    where: { barbershopId },
    orderBy: { time: 'asc' }
  });
}
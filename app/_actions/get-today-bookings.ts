"use server"
import { startOfDay, endOfDay } from 'date-fns';
import { db } from '../_lib/prisma';


export async function getTodayBookings() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const bookings = await db.booking.findMany({
    where: {
      date: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      service: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      date: 'asc',  
    },
  });

  return JSON.parse(JSON.stringify(bookings));
}
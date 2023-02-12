import { prisma } from "@/config";

async function getBooking(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    include: {
      Room: true,
    }
  });
}

async function create(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    }
  });
}

const bookingRepository = {
  getBooking,
  create,
};

export default bookingRepository;

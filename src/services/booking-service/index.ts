import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { BookingResponse, BookingDoneResponse } from "@/protocols";
import {
  bookingRulesError,
  notFoundError,
  roomIsFullError,
  roomNotFoundError,
  userHasntBookingError,
  userNotFoundBookingError,
} from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import { TicketStatus } from "@prisma/client";
import roomRepository from "@/repositories/room-repository";
import userRepository from "@/repositories/user-repository";

async function getBooking(userId: number): Promise<BookingResponse> {
  const result = await bookingRepository.getBooking(userId);

  if (!result) {
    throw notFoundError();
  }

  const bookingResponse = {
    id: result.id,
    Room: result.Room,
  };

  return bookingResponse;
}

async function createBooking(userId: number, roomId: number): Promise<BookingDoneResponse> {
  const room = await roomRepository.findRoomById(roomId);
  if(!room) {
    throw roomNotFoundError();
  }

  if (room.capacity === 0) {
    throw roomIsFullError();
  }
  
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if(ticket.TicketType.isRemote || ticket.status !== TicketStatus.PAID) {
    throw bookingRulesError();
  }

  const booking = await bookingRepository.create(userId, roomId);

  const resposeBookingDone = {
    bookingId: booking.id,
  };
  
  return resposeBookingDone;
}

async function updateBooking(userId: number, roomId: number, bookingId: number): Promise<BookingDoneResponse> {
  const room = await roomRepository.findRoomById(roomId);
  if(!room) {
    throw roomNotFoundError();
  }

  if (room.capacity === 0) {
    throw roomIsFullError();
  }

  const user = await userRepository.getUserById(userId);
  if(user.Booking.length === 0) {
    throw userHasntBookingError();
  }

  const booking = await bookingRepository.getBookingByIdAndUserId(bookingId, userId);
  if(!booking) {
    throw userNotFoundBookingError();
  }

  await bookingRepository.update(roomId, booking.id);

  return {
    bookingId: booking.id
  };
}

const bookingService = {
  getBooking,
  createBooking,
  updateBooking
};

export default bookingService;

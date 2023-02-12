import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { BookingResponse, BookingDoneResponse } from "@/protocols";
import {
  bookingRulesError,
  notFoundError,
  roomIsFullError,
  roomNotFoundError,
} from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import { TicketStatus } from "@prisma/client";
import roomRepository from "@/repositories/room-repository";

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

const bookingService = {
  getBooking,
  createBooking,
};

export default bookingService;

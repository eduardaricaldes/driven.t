import { BookingResponse } from "@/protocols";
import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";

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

const bookingService = {
  getBooking,
};

export default bookingService;

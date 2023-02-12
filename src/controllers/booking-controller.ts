import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import bookingService from "@/services/booking-service";

export async function getBookingByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const userBooking = await bookingService.getBooking(userId);

    return res.status(httpStatus.OK).send(userBooking);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

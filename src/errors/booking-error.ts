import httpStatus from "http-status";
import { ApplicationError } from "@/protocols";

export function roomNotFoundError(): ApplicationBookingError {
  return {
    name: "BookingError",
    message: "No result for this search!",
    status: httpStatus.NOT_FOUND,
  };
}

export function roomIsFullError(): ApplicationBookingError {
  return {
    name: "BookingError",
    message: "Room is full",
    status: httpStatus.FORBIDDEN,
  };
}

export function bookingRulesError(): ApplicationBookingError {
  return {
    name: "BookingError",
    message: "It is necessary to have a face-to-face ticket and paid accommodation",
    status: httpStatus.FORBIDDEN,
  };
}

export type ApplicationBookingError = ApplicationError & {
  status: number;
};

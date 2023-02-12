import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getBookingByUser, booking } from "@/controllers";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", getBookingByUser)
  .post("/", booking);

export { bookingRouter };

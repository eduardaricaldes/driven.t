import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getBookingByUser } from "@/controllers";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", getBookingByUser);

export { bookingRouter };

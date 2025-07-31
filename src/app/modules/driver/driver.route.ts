import express from "express";
import { USER_ROLES } from "../../../enums/user";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { DriverController } from "./driver.controller";
import { DriverValidation } from "./driver.validation";

const router = express.Router();

router.post(
  "/rides/accept-reject",
  auth(USER_ROLES.driver),
  validateRequest(DriverValidation.acceptRejectRideZodSchema),
  DriverController.acceptRejectRide
);

router.patch(
  "/rides/:rideId/status",
  auth(USER_ROLES.driver),
  validateRequest(DriverValidation.updateRideStatusZodSchema),
  DriverController.updateRideStatus
);

router.patch(
  "/availability",
  auth(USER_ROLES.driver),
  validateRequest(DriverValidation.setAvailabilityZodSchema),
  DriverController.setAvailability
);

router.get(
  "/earnings/history",
  auth(USER_ROLES.driver),
  DriverController.getEarningsHistory
);

export const DriverRoutes = router;

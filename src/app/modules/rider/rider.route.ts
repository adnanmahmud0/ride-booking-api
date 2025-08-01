import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../../../enums/user';
import { RideController } from './rider.controller';
import { RideValidation } from './rider.validation';

const router = express.Router();

router.post(
  '/request',
  auth(USER_ROLES.rider),
  validateRequest(RideValidation.rideRequestZodSchema),
  RideController.requestRide
);

router.patch(
  '/cancel/:id',
  auth(USER_ROLES.rider),
  RideController.cancelRide
);

router.patch(
  '/accept-reject',
  auth(USER_ROLES.driver),
  validateRequest(RideValidation.acceptRejectZodSchema),
  RideController.acceptOrRejectRide
);

router.patch(
  '/status',
  auth(USER_ROLES.driver),
  validateRequest(RideValidation.updateRideStatusZodSchema),
  RideController.updateRideStatus
);

router.get('/my-rides', auth(USER_ROLES.rider, USER_ROLES.driver), RideController.getMyRides);

export const RiderRoutes = router;
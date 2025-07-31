import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { RiderController } from './rider.controller';
import { RiderValidation } from './rider.validation';

const router = express.Router();

router.post(
  '/rides/request',
  auth(USER_ROLES.rider),
  validateRequest(RiderValidation.requestRideZodSchema),
  RiderController.requestRide
);

router.patch(
  '/rides/:rideId/cancel',
  auth(USER_ROLES.rider),
  validateRequest(RiderValidation.cancelRideZodSchema),
  RiderController.cancelRide
);

router.get(
  '/rides/history',
  auth(USER_ROLES.rider),
  RiderController.getRideHistory
);

export const RiderRoutes = router;
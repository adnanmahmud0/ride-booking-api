// rider.route.ts

import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { RiderController } from './rider.controller';
import { RiderValidation } from './rider.validation';
const router = express.Router();

router.post(
  '/request',
  auth(USER_ROLES.rider),
  validateRequest(RiderValidation.requestRideZodSchema),
  RiderController.requestRide
);

router.patch(
  '/:id/cancel',
  auth(USER_ROLES.rider),
  RiderController.cancelRide
);

router.get(
  '/all-rides',
  auth(USER_ROLES.rider),
  RiderController.getRiderRides
);

router.post(
  '/:id/pay',
  auth(USER_ROLES.rider),
  validateRequest(RiderValidation.payForRideZodSchema),
  RiderController.payForRide
);

router.get(
  '/admin/rides',
  auth(USER_ROLES.admin, USER_ROLES.super_admin),
  RiderController.getAllRides
);

export const RiderRoutes = router;
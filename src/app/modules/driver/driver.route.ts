import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { DriverValidation } from './driver.validation';
import { DriverController } from './driver.controller';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

// Driver Routes
router.post(
  '/create-profile',
  auth(USER_ROLES.driver),
  validateRequest(DriverValidation.createDriverProfileZodSchema),
  DriverController.createDriverProfile
);
router.patch(
  '/update-profile',
  auth(USER_ROLES.driver),
  validateRequest(DriverValidation.updateDriverProfileZodSchema),
  DriverController.updateDriverProfile
);
router.get('/me', auth(USER_ROLES.driver), DriverController.getMyDriverProfile);
router.patch(
  '/set-availability',
  auth(USER_ROLES.driver),
  validateRequest(DriverValidation.setAvailabilityZodSchema),
  DriverController.setAvailability
);
router.get('/earnings', auth(USER_ROLES.driver), DriverController.getEarnings);

// Admin Routes
router.patch('/approve/:id', auth(USER_ROLES.admin), DriverController.approveDriver);
router.patch('/suspend/:id', auth(USER_ROLES.admin), DriverController.suspendDriver);

export const DriverRoutes = router;
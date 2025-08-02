// driver.route.ts
import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { DriverController } from './driver.controller';
import { DriverValidation } from './driver.validation';
const router = express.Router();

router.post(
  '/create-profile',
  auth(USER_ROLES.driver),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = DriverValidation.createDriverZodSchema.parse(JSON.parse(req.body.data));
    }
    return DriverController.createDriverProfile(req, res, next);
  }
);

router.get(
  '/profile',
  auth(USER_ROLES.driver, USER_ROLES.admin, USER_ROLES.super_admin),
  DriverController.getDriverProfile
);

router.patch(
  '/update-profile',
  auth(USER_ROLES.driver),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = DriverValidation.updateDriverZodSchema.parse(JSON.parse(req.body.data));
    }
    return DriverController.updateDriverProfile(req, res, next);
  }
);

router.patch(
  '/admin/drivers/approve/:id',
  auth(USER_ROLES.admin, USER_ROLES.super_admin),
  DriverController.approveDriver
);

router.patch(
  '/admin/drivers/suspend/:id',
  auth(USER_ROLES.admin, USER_ROLES.super_admin),
  DriverController.suspendDriver
);

router.patch(
  '/rides/:id/accept',
  auth(USER_ROLES.driver),
  DriverController.acceptRide
);

router.patch(
  '/rides/:id/reject',
  auth(USER_ROLES.driver),
  DriverController.rejectRide
);

router.patch(
  '/rides/:id/status',
  auth(USER_ROLES.driver),
  validateRequest(DriverValidation.updateRideStatusZodSchema),
  DriverController.updateRideStatus
);

router.patch(
  '/availability',
  auth(USER_ROLES.driver),
  DriverController.toggleAvailability
);

router.get(
  '/rides',
  auth(USER_ROLES.driver),
  DriverController.getDriverRides
);

router.get(
  '/earnings',
  auth(USER_ROLES.driver),
  DriverController.getDriverEarnings
);

export const DriverRoutes = router;
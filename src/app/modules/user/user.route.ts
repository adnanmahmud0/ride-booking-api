// user.route.ts

import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router
  .route('/profile')
  .get(auth(USER_ROLES.admin, USER_ROLES.driver, USER_ROLES.rider), UserController.getUserProfile)
  .patch(
    auth(USER_ROLES.super_admin, USER_ROLES.admin, USER_ROLES.driver, USER_ROLES.rider),
    fileUploadHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = UserValidation.updateUserZodSchema.parse(
          JSON.parse(req.body.data)
        );
      }
      return UserController.updateProfile(req, res, next);
    }
  );

router.get(
  '/admin/users',
  auth(USER_ROLES.admin, USER_ROLES.super_admin),
  UserController.getAllUsers
);

router.patch(
  '/admin/users/block/:id',
  auth(USER_ROLES.admin, USER_ROLES.super_admin),
  UserController.blockUser
);

router.patch(
  '/admin/users/unblock/:id',
  auth(USER_ROLES.admin, USER_ROLES.super_admin),
  UserController.unblockUser
);

router.delete(
  '/admin/users/:id',
  auth(USER_ROLES.super_admin),
  UserController.deleteUser
);

router.patch(
  '/admin/system/settings',
  auth(USER_ROLES.super_admin),
  validateRequest(UserValidation.updateSystemSettingsZodSchema),
  UserController.updateSystemSettings
);

router.get(
  '/admin/system/settings',
  auth(USER_ROLES.super_admin),
  UserController.getSystemSettings
);

export const UserRoutes = router;
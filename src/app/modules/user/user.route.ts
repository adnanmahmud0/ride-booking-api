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

router
  .route('/register')
  .post(
    validateRequest(UserValidation.createUserZodSchema),
    UserController.createUser
  );

router
  .route('/update-user')
  .patch(
    auth(USER_ROLES.super_admin, USER_ROLES.admin, USER_ROLES.driver, USER_ROLES.rider),
    fileUploadHandler(),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.data) {
        req.body = UserValidation.updateUserZodSchema.parse(
          JSON.parse(req.body.data)
        );
      }
      return UserController.updateUser(req, res, next);
    }
  );

export const UserRoutes = router;
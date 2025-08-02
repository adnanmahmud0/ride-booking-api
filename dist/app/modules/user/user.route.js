"use strict";
// user.route.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploadHandler_1 = __importDefault(require("../../middlewares/fileUploadHandler"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router
    .route('/profile')
    .get((0, auth_1.default)(user_1.USER_ROLES.admin, user_1.USER_ROLES.driver, user_1.USER_ROLES.rider), user_controller_1.UserController.getUserProfile)
    .patch((0, auth_1.default)(user_1.USER_ROLES.super_admin, user_1.USER_ROLES.admin, user_1.USER_ROLES.driver, user_1.USER_ROLES.rider), (0, fileUploadHandler_1.default)(), (req, res, next) => {
    if (req.body.data) {
        req.body = user_validation_1.UserValidation.updateUserZodSchema.parse(JSON.parse(req.body.data));
    }
    return user_controller_1.UserController.updateProfile(req, res, next);
});
router.get('/admin/users', (0, auth_1.default)(user_1.USER_ROLES.admin, user_1.USER_ROLES.super_admin), user_controller_1.UserController.getAllUsers);
router.patch('/admin/users/block/:id', (0, auth_1.default)(user_1.USER_ROLES.admin, user_1.USER_ROLES.super_admin), user_controller_1.UserController.blockUser);
router.patch('/admin/users/unblock/:id', (0, auth_1.default)(user_1.USER_ROLES.admin, user_1.USER_ROLES.super_admin), user_controller_1.UserController.unblockUser);
router.delete('/admin/users/:id', (0, auth_1.default)(user_1.USER_ROLES.super_admin), user_controller_1.UserController.deleteUser);
router.patch('/admin/system/settings', (0, auth_1.default)(user_1.USER_ROLES.super_admin), (0, validateRequest_1.default)(user_validation_1.UserValidation.updateSystemSettingsZodSchema), user_controller_1.UserController.updateSystemSettings);
router.get('/admin/system/settings', (0, auth_1.default)(user_1.USER_ROLES.super_admin), user_controller_1.UserController.getSystemSettings);
exports.UserRoutes = router;

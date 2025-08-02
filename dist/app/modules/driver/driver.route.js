"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverRoutes = void 0;
// driver.route.ts
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploadHandler_1 = __importDefault(require("../../middlewares/fileUploadHandler"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const driver_controller_1 = require("./driver.controller");
const driver_validation_1 = require("./driver.validation");
const router = express_1.default.Router();
router.post('/create-profile', (0, auth_1.default)(user_1.USER_ROLES.driver), (0, fileUploadHandler_1.default)(), (req, res, next) => {
    if (req.body.data) {
        req.body = driver_validation_1.DriverValidation.createDriverZodSchema.parse(JSON.parse(req.body.data));
    }
    return driver_controller_1.DriverController.createDriverProfile(req, res, next);
});
router.get('/profile', (0, auth_1.default)(user_1.USER_ROLES.driver, user_1.USER_ROLES.admin, user_1.USER_ROLES.super_admin), driver_controller_1.DriverController.getDriverProfile);
router.patch('/update-profile', (0, auth_1.default)(user_1.USER_ROLES.driver), (0, fileUploadHandler_1.default)(), (req, res, next) => {
    if (req.body.data) {
        req.body = driver_validation_1.DriverValidation.updateDriverZodSchema.parse(JSON.parse(req.body.data));
    }
    return driver_controller_1.DriverController.updateDriverProfile(req, res, next);
});
router.patch('/admin/drivers/approve/:id', (0, auth_1.default)(user_1.USER_ROLES.admin, user_1.USER_ROLES.super_admin), driver_controller_1.DriverController.approveDriver);
router.patch('/admin/drivers/suspend/:id', (0, auth_1.default)(user_1.USER_ROLES.admin, user_1.USER_ROLES.super_admin), driver_controller_1.DriverController.suspendDriver);
router.patch('/rides/:id/accept', (0, auth_1.default)(user_1.USER_ROLES.driver), driver_controller_1.DriverController.acceptRide);
router.patch('/rides/:id/reject', (0, auth_1.default)(user_1.USER_ROLES.driver), driver_controller_1.DriverController.rejectRide);
router.patch('/rides/:id/status', (0, auth_1.default)(user_1.USER_ROLES.driver), (0, validateRequest_1.default)(driver_validation_1.DriverValidation.updateRideStatusZodSchema), driver_controller_1.DriverController.updateRideStatus);
router.patch('/availability', (0, auth_1.default)(user_1.USER_ROLES.driver), driver_controller_1.DriverController.toggleAvailability);
router.get('/rides', (0, auth_1.default)(user_1.USER_ROLES.driver), driver_controller_1.DriverController.getDriverRides);
router.get('/earnings', (0, auth_1.default)(user_1.USER_ROLES.driver), driver_controller_1.DriverController.getDriverEarnings);
exports.DriverRoutes = router;

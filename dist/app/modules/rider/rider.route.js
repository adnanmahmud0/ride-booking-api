"use strict";
// rider.route.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const rider_controller_1 = require("./rider.controller");
const rider_validation_1 = require("./rider.validation");
const router = express_1.default.Router();
router.post('/request', (0, auth_1.default)(user_1.USER_ROLES.rider), (0, validateRequest_1.default)(rider_validation_1.RiderValidation.requestRideZodSchema), rider_controller_1.RiderController.requestRide);
router.patch('/:id/cancel', (0, auth_1.default)(user_1.USER_ROLES.rider), rider_controller_1.RiderController.cancelRide);
router.get('/all-rides', (0, auth_1.default)(user_1.USER_ROLES.rider), rider_controller_1.RiderController.getRiderRides);
router.post('/:id/pay', (0, auth_1.default)(user_1.USER_ROLES.rider), (0, validateRequest_1.default)(rider_validation_1.RiderValidation.payForRideZodSchema), rider_controller_1.RiderController.payForRide);
router.get('/admin/rides', (0, auth_1.default)(user_1.USER_ROLES.admin, user_1.USER_ROLES.super_admin), rider_controller_1.RiderController.getAllRides);
exports.RiderRoutes = router;

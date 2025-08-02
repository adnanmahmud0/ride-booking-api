"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const getFilePath_1 = require("../../../shared/getFilePath");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const driver_service_1 = require("./driver.service");
const createDriverProfile = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let licenseImage = (0, getFilePath_1.getSingleFilePath)(req.files, 'licenseImage');
    const data = Object.assign(Object.assign({}, req.body), { licenseImage });
    const result = yield driver_service_1.DriverService.createDriverProfile(user, data);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Driver profile created successfully',
        data: result,
    });
}));
const getDriverProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { driverId } = req.query;
    const result = yield driver_service_1.DriverService.getDriverProfile(req.user, driverId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Driver profile retrieved successfully',
        data: result,
    });
}));
const updateDriverProfile = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let licenseImage = (0, getFilePath_1.getSingleFilePath)(req.files, 'licenseImage');
    const data = Object.assign(Object.assign({}, req.body), { licenseImage });
    const result = yield driver_service_1.DriverService.updateDriverProfile(user, data);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Driver profile updated successfully',
        data: result,
    });
}));
const approveDriver = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield driver_service_1.DriverService.approveDriver(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Driver approved successfully',
        data: result,
    });
}));
const suspendDriver = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield driver_service_1.DriverService.suspendDriver(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Driver suspended successfully',
        data: result,
    });
}));
const acceptRide = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield driver_service_1.DriverService.acceptRide(req.user, req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Ride accepted successfully',
        data: result,
    });
}));
const rejectRide = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield driver_service_1.DriverService.rejectRide(req.user, req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Ride rejected successfully',
        data: result,
    });
}));
const updateRideStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield driver_service_1.DriverService.updateRideStatus(req.user, req.params.id, req.body.status);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Ride status updated successfully',
        data: result,
    });
}));
const toggleAvailability = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield driver_service_1.DriverService.toggleAvailability(req.user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Availability updated successfully',
        data: result,
    });
}));
const getDriverRides = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield driver_service_1.DriverService.getDriverRides(req.user);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Driver rides retrieved successfully',
        data: result,
    });
}));
const getDriverEarnings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate } = req.query;
    const result = yield driver_service_1.DriverService.getDriverEarnings(req.user, startDate, endDate);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: 'Driver earnings retrieved successfully',
        data: result,
    });
}));
exports.DriverController = {
    createDriverProfile,
    getDriverProfile,
    updateDriverProfile,
    approveDriver,
    suspendDriver,
    acceptRide,
    rejectRide,
    updateRideStatus,
    toggleAvailability,
    getDriverRides,
    getDriverEarnings,
};

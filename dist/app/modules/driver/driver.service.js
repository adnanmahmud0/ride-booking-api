"use strict";
// driver.service.ts
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
exports.DriverService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
const driver_model_1 = require("./driver.model");
const rider_model_1 = require("../rider/rider.model");
const ride_1 = require("../../../enums/ride");
const user_1 = require("../../../enums/user");
const systemSettings_model_1 = require("../systemSettings/systemSettings.model");
const createDriverProfile = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role !== user_1.USER_ROLES.driver) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Only drivers can create a profile');
    }
    const existingProfile = yield driver_model_1.Driver.findOne({ userId: user.id });
    if (existingProfile) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Driver profile already exists');
    }
    const driver = yield driver_model_1.Driver.create(Object.assign({ userId: user.id }, payload));
    return driver;
});
const getDriverProfile = (user, driverId) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role === user_1.USER_ROLES.driver && driverId && driverId !== user.id) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Drivers can only view their own profile');
    }
    const query = user.role === user_1.USER_ROLES.driver ? { userId: user.id } : { _id: driverId };
    if (!query._id && !query.userId) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Driver ID required for admin access');
    }
    const driver = yield driver_model_1.Driver.findOne(query).populate('userId', 'name email contact location role');
    if (!driver) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Driver profile not found');
    }
    return driver;
});
const updateDriverProfile = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role !== user_1.USER_ROLES.driver) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Only drivers can update their profile');
    }
    const driver = yield driver_model_1.Driver.findOne({ userId: user.id });
    if (!driver) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Driver profile not found');
    }
    if (payload.licenseImage && driver.driverInfo.licenseImage) {
        (0, unlinkFile_1.default)(driver.driverInfo.licenseImage);
    }
    const updatedDriver = yield driver_model_1.Driver.findOneAndUpdate({ userId: user.id }, payload, { new: true });
    return updatedDriver;
});
const approveDriver = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findById(driverId);
    if (!driver)
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Driver not found');
    driver.isApproved = true;
    driver.availability = 'online';
    yield driver.save();
    return driver;
});
const suspendDriver = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findById(driverId);
    if (!driver)
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Driver not found');
    driver.isApproved = false;
    driver.availability = 'offline';
    yield driver.save();
    return driver;
});
const acceptRide = (user, rideId) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role !== user_1.USER_ROLES.driver) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Only drivers can accept rides');
    }
    const driver = yield driver_model_1.Driver.findOne({ userId: user.id });
    if (!driver || !driver.isApproved || driver.availability !== 'online') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Driver not approved or offline');
    }
    const ride = yield rider_model_1.Ride.findById(rideId);
    if (!ride || ride.status !== ride_1.RIDE_STATUSES.requested) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Ride not found or not in requested status');
    }
    ride.driver = user.id;
    ride.status = ride_1.RIDE_STATUSES.accepted;
    yield ride.save();
    return ride;
});
const rejectRide = (user, rideId) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role !== user_1.USER_ROLES.driver) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Only drivers can reject rides');
    }
    const ride = yield rider_model_1.Ride.findById(rideId);
    if (!ride || ride.status !== ride_1.RIDE_STATUSES.requested) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Ride not found or not in requested status');
    }
    ride.status = ride_1.RIDE_STATUSES.rejected;
    yield ride.save();
    return ride;
});
const updateRideStatus = (user, rideId, status) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role !== user_1.USER_ROLES.driver) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Only drivers can update ride status');
    }
    const ride = yield rider_model_1.Ride.findById(rideId);
    if (!ride || !ride.driver || ride.driver.toString() !== user.id) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Ride not found or not assigned to this driver');
    }
    if (!Object.values(ride_1.RIDE_STATUSES).includes(status)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid ride status');
    }
    ride.status = status;
    yield ride.save();
    return ride;
});
const toggleAvailability = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role !== user_1.USER_ROLES.driver) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Only drivers can toggle availability');
    }
    const driver = yield driver_model_1.Driver.findOne({ userId: user.id });
    if (!driver) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Driver profile not found');
    }
    if (!driver.isApproved) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Driver not approved');
    }
    driver.availability = driver.availability === 'online' ? 'offline' : 'online';
    yield driver.save();
    return driver;
});
const getDriverRides = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role !== user_1.USER_ROLES.driver) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Only drivers can view their rides');
    }
    const rides = yield rider_model_1.Ride.find({ driver: user.id }).populate('rider driver');
    return rides;
});
const getDriverEarnings = (user, startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role !== user_1.USER_ROLES.driver) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Only drivers can view their earnings');
    }
    const driver = yield driver_model_1.Driver.findOne({ userId: user.id });
    if (!driver) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Driver profile not found');
    }
    const systemSettings = yield systemSettings_model_1.SystemSettings.findOne();
    if (!systemSettings) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'System settings not found');
    }
    const query = { driver: user.id, status: ride_1.RIDE_STATUSES.completed };
    if (startDate)
        query.createdAt = { $gte: new Date(startDate) };
    if (endDate)
        query.createdAt = Object.assign(Object.assign({}, query.createdAt), { $lte: new Date(endDate) });
    const rides = yield rider_model_1.Ride.find(query).select('status createdAt updatedAt');
    // Fallback: Assume a fixed earning per completed ride if distanceKm/fare are unavailable
    const fixedEarningPerRide = systemSettings.farePerKm || 10; // Default to 10 if farePerKm is 0
    const totalEarnings = rides.length * fixedEarningPerRide;
    return {
        totalEarnings,
        rideCount: rides.length,
        rides,
    };
});
exports.DriverService = {
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

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
exports.RiderService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const rider_model_1 = require("./rider.model");
const ride_1 = require("../../../enums/ride");
const user_1 = require("../../../enums/user");
const systemSettings_model_1 = require("../systemSettings/systemSettings.model");
const parseCoordinates = (location) => {
    const [longitude, latitude] = location.split(',').map(coord => parseFloat(coord.trim()));
    if (isNaN(longitude) || isNaN(latitude)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid coordinate format');
    }
    return [longitude, latitude];
};
const calculateDistance = (pickup, destination) => {
    const [lon1, lat1] = pickup;
    const [lon2, lat2] = destination;
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
const requestRide = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role !== user_1.USER_ROLES.rider) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Only riders can request rides');
    }
    const settings = yield systemSettings_model_1.SystemSettings.findOne();
    if (!settings) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'System settings not found');
    }
    const pickupCoords = parseCoordinates(payload.pickupLocation);
    const destinationCoords = parseCoordinates(payload.destinationLocation);
    const distance = calculateDistance(pickupCoords, destinationCoords);
    const fare = distance * settings.farePerKm;
    const rideData = {
        rider: user.id,
        pickupLocation: {
            type: 'Point',
            coordinates: pickupCoords,
        },
        destinationLocation: {
            type: 'Point',
            coordinates: destinationCoords,
        },
        fare,
        status: ride_1.RIDE_STATUSES.requested,
    };
    const ride = yield rider_model_1.Ride.create(rideData);
    return ride;
});
const cancelRide = (user, rideId) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role !== user_1.USER_ROLES.rider) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Only riders can cancel rides');
    }
    const ride = yield rider_model_1.Ride.findById(rideId);
    if (!ride || ride.rider.toString() !== user.id) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Ride not found or not owned by this rider');
    }
    if (ride.status !== ride_1.RIDE_STATUSES.requested && ride.status !== ride_1.RIDE_STATUSES.accepted) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Ride cannot be cancelled in this status');
    }
    const settings = yield systemSettings_model_1.SystemSettings.findOne();
    if (!settings) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'System settings not found');
    }
    if (ride.timestamps.requestedAt && (Date.now() - ride.timestamps.requestedAt.getTime()) > settings.cancellationWindowMinutes * 60000) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Cancellation window has expired');
    }
    ride.status = ride_1.RIDE_STATUSES.cancelled;
    ride.timestamps.cancelledAt = new Date();
    yield ride.save();
    return ride;
});
const getRiderRides = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role !== user_1.USER_ROLES.rider) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Only riders can view their rides');
    }
    const rides = yield rider_model_1.Ride.find({ rider: user.id }).populate('rider driver');
    return rides;
});
const payForRide = (user, rideId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role !== user_1.USER_ROLES.rider) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Only riders can make payments');
    }
    const ride = yield rider_model_1.Ride.findById(rideId);
    if (!ride || ride.rider.toString() !== user.id) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Ride not found or not owned by this rider');
    }
    if (ride.status !== ride_1.RIDE_STATUSES.completed) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Ride must be completed before payment');
    }
    if (ride.paymentStatus === 'completed') {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Ride already paid');
    }
    ride.paymentStatus = 'completed';
    yield ride.save();
    return ride;
});
const getAllRides = () => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield rider_model_1.Ride.find({}).populate('rider driver');
    return rides;
});
exports.RiderService = {
    requestRide,
    cancelRide,
    getRiderRides,
    payForRide,
    getAllRides,
};

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
exports.GeoUtils = void 0;
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const calculateDistance = (origin, destination) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Parse coordinates (expected format: "lng,lat")
        const [originLng, originLat] = origin.split(',').map(Number);
        const [destLng, destLat] = destination.split(',').map(Number);
        if (isNaN(originLng) || isNaN(originLat) || isNaN(destLng) || isNaN(destLat)) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid coordinate format. Use "lng,lat" (e.g., "-74.0060,40.7128")');
        }
        // Earth's radius in kilometers
        const R = 6371;
        // Convert latitude and longitude to radians
        const lat1 = (originLat * Math.PI) / 180;
        const lat2 = (destLat * Math.PI) / 180;
        const deltaLat = ((destLat - originLat) * Math.PI) / 180;
        const deltaLng = ((destLng - originLng) * Math.PI) / 180;
        // Haversine formula
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to calculate distance');
    }
});
exports.GeoUtils = {
    calculateDistance,
};

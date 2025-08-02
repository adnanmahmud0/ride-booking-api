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
exports.socketHelper = void 0;
const colors_1 = __importDefault(require("colors"));
const mongoose_1 = require("mongoose");
const looger_1 = require("../shared/looger");
const driver_model_1 = require("../app/modules/driver/driver.model");
const socket = (io) => {
    io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
        looger_1.logger.info(colors_1.default.blue(`A user connected: ${socket.id}`));
        // Authenticate user and join user-specific room
        socket.on('authenticate', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { userId, role } = data;
            if (!mongoose_1.Types.ObjectId.isValid(userId) || !['rider', 'driver'].includes(role)) {
                socket.emit('error', { message: 'Invalid user ID or role' });
                return;
            }
            socket.user = { id: userId, role };
            socket.join(`user:${userId}`);
            looger_1.logger.info(colors_1.default.green(`User ${userId} (${role}) authenticated and joined room user:${userId}`));
            // If driver, check availability and join online-drivers room if online
            if (role === 'driver') {
                const driver = yield driver_model_1.Driver.findOne({ user: userId });
                if (driver && driver.availability === 'online') {
                    socket.join('online-drivers');
                    looger_1.logger.info(colors_1.default.green(`Driver ${userId} joined online-drivers room`));
                }
            }
        }));
        // Handle driver availability change
        socket.on('updateAvailability', (data) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const { userId, availability } = data;
            if (((_a = socket.user) === null || _a === void 0 ? void 0 : _a.id) !== userId || ((_b = socket.user) === null || _b === void 0 ? void 0 : _b.role) !== 'driver') {
                socket.emit('error', { message: 'Unauthorized or invalid role' });
                return;
            }
            if (availability === 'online') {
                socket.join('online-drivers');
                looger_1.logger.info(colors_1.default.green(`Driver ${userId} joined online-drivers room`));
            }
            else {
                socket.leave('online-drivers');
                looger_1.logger.info(colors_1.default.yellow(`Driver ${userId} left online-drivers room`));
            }
        }));
        // Handle ride request (broadcast to online drivers)
        socket.on('rideRequest', (data) => {
            const { rideId, riderId } = data;
            io.to('online-drivers').emit('newRideRequest', { rideId, riderId });
            looger_1.logger.info(colors_1.default.blue(`Ride request ${rideId} broadcasted to online drivers`));
        });
        // Handle ride acceptance/rejection
        socket.on('rideAction', (data) => {
            const { rideId, driverId, riderId, action } = data;
            io.to(`user:${riderId}`).emit(`ride${action.charAt(0).toUpperCase() + action.slice(1)}ed`, {
                rideId,
                driverId,
                action,
            });
            looger_1.logger.info(colors_1.default.blue(`Ride ${rideId} ${action}ed by driver ${driverId}, notified rider ${riderId}`));
        });
        // Handle ride status update
        socket.on('rideStatusUpdate', (data) => {
            const { rideId, riderId, status } = data;
            io.to(`user:${riderId}`).emit('rideStatusUpdated', { rideId, status });
            looger_1.logger.info(colors_1.default.blue(`Ride ${rideId} status updated to ${status}, notified rider ${riderId}`));
        });
        // Handle ride cancellation
        socket.on('rideCancelled', (data) => {
            const { rideId, riderId, driverId } = data;
            if (driverId) {
                io.to(`user:${driverId}`).emit('rideCancelled', { rideId, riderId });
                looger_1.logger.info(colors_1.default.blue(`Ride ${rideId} cancelled by rider ${riderId}, notified driver ${driverId}`));
            }
        });
        // Handle disconnection
        socket.on('disconnect', () => {
            if (socket.user) {
                socket.leave(`user:${socket.user.id}`);
                if (socket.user.role === 'driver') {
                    socket.leave('online-drivers');
                }
                looger_1.logger.info(colors_1.default.red(`User ${socket.user.id} disconnected`));
            }
            else {
                looger_1.logger.info(colors_1.default.red(`Socket ${socket.id} disconnected`));
            }
        });
    }));
};
exports.socketHelper = { socket };

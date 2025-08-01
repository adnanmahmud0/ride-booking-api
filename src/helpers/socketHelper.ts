import colors from 'colors';
import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';
import { logger } from '../shared/looger';
import { Driver } from '../app/modules/driver/driver.model';

interface AuthenticatedSocket extends Socket {
  user?: { id: string; role: string };
}

const socket = (io: Server) => {
  io.on('connection', async (socket: AuthenticatedSocket) => {
    logger.info(colors.blue(`A user connected: ${socket.id}`));

    // Authenticate user and join user-specific room
    socket.on('authenticate', async (data: { userId: string; role: string }) => {
      const { userId, role } = data;
      if (!Types.ObjectId.isValid(userId) || !['rider', 'driver'].includes(role)) {
        socket.emit('error', { message: 'Invalid user ID or role' });
        return;
      }
      socket.user = { id: userId, role };
      socket.join(`user:${userId}`);
      logger.info(colors.green(`User ${userId} (${role}) authenticated and joined room user:${userId}`));

      // If driver, check availability and join online-drivers room if online
      if (role === 'driver') {
        const driver = await Driver.findOne({ user: userId });
        if (driver && driver.availability === 'online') {
          socket.join('online-drivers');
          logger.info(colors.green(`Driver ${userId} joined online-drivers room`));
        }
      }
    });

    // Handle driver availability change
    socket.on('updateAvailability', async (data: { userId: string; availability: 'online' | 'offline' }) => {
      const { userId, availability } = data;
      if (socket.user?.id !== userId || socket.user?.role !== 'driver') {
        socket.emit('error', { message: 'Unauthorized or invalid role' });
        return;
      }
      if (availability === 'online') {
        socket.join('online-drivers');
        logger.info(colors.green(`Driver ${userId} joined online-drivers room`));
      } else {
        socket.leave('online-drivers');
        logger.info(colors.yellow(`Driver ${userId} left online-drivers room`));
      }
    });

    // Handle ride request (broadcast to online drivers)
    socket.on('rideRequest', (data: { rideId: string; riderId: string }) => {
      const { rideId, riderId } = data;
      io.to('online-drivers').emit('newRideRequest', { rideId, riderId });
      logger.info(colors.blue(`Ride request ${rideId} broadcasted to online drivers`));
    });

    // Handle ride acceptance/rejection
    socket.on('rideAction', (data: { rideId: string; driverId: string; riderId: string; action: 'accept' | 'reject' }) => {
      const { rideId, driverId, riderId, action } = data;
      io.to(`user:${riderId}`).emit(`ride${action.charAt(0).toUpperCase() + action.slice(1)}ed`, {
        rideId,
        driverId,
        action,
      });
      logger.info(colors.blue(`Ride ${rideId} ${action}ed by driver ${driverId}, notified rider ${riderId}`));
    });

    // Handle ride status update
    socket.on('rideStatusUpdate', (data: { rideId: string; riderId: string; status: string }) => {
      const { rideId, riderId, status } = data;
      io.to(`user:${riderId}`).emit('rideStatusUpdated', { rideId, status });
      logger.info(colors.blue(`Ride ${rideId} status updated to ${status}, notified rider ${riderId}`));
    });

    // Handle ride cancellation
    socket.on('rideCancelled', (data: { rideId: string; riderId: string; driverId?: string }) => {
      const { rideId, riderId, driverId } = data;
      if (driverId) {
        io.to(`user:${driverId}`).emit('rideCancelled', { rideId, riderId });
        logger.info(colors.blue(`Ride ${rideId} cancelled by rider ${riderId}, notified driver ${driverId}`));
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      if (socket.user) {
        socket.leave(`user:${socket.user.id}`);
        if (socket.user.role === 'driver') {
          socket.leave('online-drivers');
        }
        logger.info(colors.red(`User ${socket.user.id} disconnected`));
      } else {
        logger.info(colors.red(`Socket ${socket.id} disconnected`));
      }
    });
  });
};

export const socketHelper = { socket };
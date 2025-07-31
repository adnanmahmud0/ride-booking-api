import { Schema, model } from 'mongoose';
import { IUser, UserModal } from '../user/user.interface';
import { User } from '../user/user.model';
import { IDriver } from './driver.interface';

const vehicleInfoSchema = new Schema(
    {
        type: { type: String },
        plate: { type: String },
    },
    { _id: false }
);

const driverSchema = new Schema<IDriver>(
    {
        approvalStatus: {
            type: String,
            enum: ['pending', 'approved', 'suspended'],
            default: 'pending',
        },
        availability: {
            type: String,
            enum: ['online', 'offline'],
            default: 'offline',
        },
        vehicleInfo: {
            type: vehicleInfoSchema,
        },
    },
    { discriminatorKey: 'role', timestamps: true }
);


// Add static method
driverSchema.statics.isDriverApproved = async function (id: string): Promise<boolean> {
    const driver = await Driver.findById(id) as IDriver | null;
    return driver ? driver.approvalStatus === 'approved' : false;
};

// Create a Driver discriminator on the User model
// Remove the generic <IUser, UserModal> from the discriminator since it inherits from User
export const Driver = User.discriminator<IUser>('driver', driverSchema);
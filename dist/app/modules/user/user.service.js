"use strict";
// user.service.ts
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
exports.UserService = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const unlinkFile_1 = __importDefault(require("../../../shared/unlinkFile"));
const user_model_1 = require("./user.model");
const systemSettings_model_1 = require("../systemSettings/systemSettings.model");
const user_1 = require("../../../enums/user");
const getUserProfileFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    return isExistUser;
});
const updateProfileToDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = user;
    const isExistUser = yield user_model_1.User.isExistUserById(id);
    if (!isExistUser) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User doesn't exist!");
    }
    if (payload.image) {
        (0, unlinkFile_1.default)(isExistUser.image);
    }
    const updateDoc = yield user_model_1.User.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return updateDoc;
});
const getAllUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({}).select('-password -authentication');
    return users;
});
const blockUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    if (user.role === user_1.USER_ROLES.super_admin) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Cannot block super-admin accounts');
    }
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ _id: userId }, { status: 'delete' }, { new: true });
    if (!updatedUser)
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    return updatedUser;
});
const unblockUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    user.status = 'active';
    yield user.save();
    return user;
});
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user)
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    if (user.role === user_1.USER_ROLES.super_admin) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Cannot delete super-admin accounts');
    }
    yield user.deleteOne();
    return { message: 'User deleted permanently' };
});
const updateSystemSettings = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = (yield systemSettings_model_1.SystemSettings.findOne()) || (yield systemSettings_model_1.SystemSettings.create({}));
    if (payload.farePerKm !== undefined) {
        settings.farePerKm = payload.farePerKm;
    }
    if (payload.cancellationWindowMinutes !== undefined) {
        settings.cancellationWindowMinutes = payload.cancellationWindowMinutes;
    }
    settings.updatedAt = new Date();
    yield settings.save();
    return settings;
});
const getSystemSettings = () => __awaiter(void 0, void 0, void 0, function* () {
    const settings = (yield systemSettings_model_1.SystemSettings.findOne()) || (yield systemSettings_model_1.SystemSettings.create({}));
    return settings;
});
exports.UserService = {
    getUserProfileFromDB,
    updateProfileToDB,
    getAllUsersFromDB,
    blockUser,
    unblockUser,
    deleteUser,
    updateSystemSettings,
    getSystemSettings,
};

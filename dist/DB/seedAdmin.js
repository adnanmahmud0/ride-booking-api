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
exports.seedSuperAdmin = void 0;
const user_model_1 = require("../app/modules/user/user.model");
const config_1 = __importDefault(require("../config"));
const user_1 = require("../enums/user");
const looger_1 = require("../shared/looger");
const payload = {
    name: 'Administrator',
    email: config_1.default.super_admin.email,
    role: user_1.USER_ROLES.super_admin,
    password: config_1.default.super_admin.password,
    verified: true,
};
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const isExistSuperAdmin = yield user_model_1.User.findOne({
        email: config_1.default.super_admin.email,
        role: user_1.USER_ROLES.super_admin,
    });
    if (!isExistSuperAdmin) {
        yield user_model_1.User.create(payload);
        looger_1.logger.info('✨ Super Admin account has been successfully created!');
    }
});
exports.seedSuperAdmin = seedSuperAdmin;

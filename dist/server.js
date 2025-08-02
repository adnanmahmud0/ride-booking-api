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
const colors_1 = __importDefault(require("colors"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const seedAdmin_1 = require("./DB/seedAdmin");
const socketHelper_1 = require("./helpers/socketHelper");
const looger_1 = require("./shared/looger");
// Uncaught exception handling
process.on('uncaughtException', error => {
    looger_1.errorLogger.error('Uncaught Exception Detected', error);
    process.exit(1);
});
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.database_url);
            looger_1.logger.info(colors_1.default.green('🚀 Database connected successfully'));
            // Seed Super Admin
            yield (0, seedAdmin_1.seedSuperAdmin)();
            const port = typeof config_1.default.port === 'number' ? config_1.default.port : Number(config_1.default.port);
            server = app_1.default.listen(port, config_1.default.ip_address, () => {
                looger_1.logger.info(colors_1.default.yellow(`♻️ Application listening on port:${port}`));
            });
            // Socket.IO setup
            const io = new socket_io_1.Server(server, {
                pingTimeout: 60000,
                cors: {
                    origin: '*',
                },
            });
            // Socket.IO error handling
            io.on('error', (error) => {
                looger_1.errorLogger.error('Socket.IO error:', error);
            });
            socketHelper_1.socketHelper.socket(io);
            globalThis.io = io; // Set global io for services
        }
        catch (error) {
            looger_1.errorLogger.error(colors_1.default.red('🤢 Failed to connect Database'), error);
            process.exit(1);
        }
        // Unhandled rejection handling
        process.on('unhandledRejection', error => {
            if (server) {
                server.close(() => {
                    looger_1.errorLogger.error('Unhandled Rejection Detected', error);
                    process.exit(1);
                });
            }
            else {
                process.exit(1);
            }
        });
    });
}
main();
// SIGTERM handling
process.on('SIGTERM', () => {
    looger_1.logger.info('SIGTERM RECEIVED');
    if (server) {
        server.close(() => {
            process.exit(0);
        });
    }
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (error) => {
    const errorMessages = error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
    }));
    const statusCode = 400;
    return {
        statusCode,
        message: 'Validation Error',
        errorMessages,
    };
};
exports.default = handleZodError;

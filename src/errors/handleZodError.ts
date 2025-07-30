import { ZodError } from 'zod';
import { IErrorMessage } from '../types/errors.types';

const handleZodError = (error: ZodError) => {
  const errorMessages: IErrorMessage[] = error.issues.map((issue) => ({
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

export default handleZodError;

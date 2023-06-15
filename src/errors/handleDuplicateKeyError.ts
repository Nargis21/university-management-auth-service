import { MongoServerError } from 'mongodb';
import { IGenericErrorMessage } from '../interfaces/error';
import httpStatus from 'http-status';

const handleDuplicateKeyError = (error: MongoServerError) => {
  const fieldWithError = Object.keys(error?.keyPattern ?? {})[0] || '';
  const errors: IGenericErrorMessage[] = [
    {
      path: fieldWithError,
      message: 'Duplicate Key Error',
    },
  ];

  return {
    statusCode: httpStatus.CONFLICT,
    message: 'Academic faculty already exist',
    errorMessages: errors,
  };
};

export default handleDuplicateKeyError;

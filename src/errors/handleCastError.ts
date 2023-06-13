import mongoose from 'mongoose';
import { IGenericErrorMessage } from '../interfaces/error';

const handleCastError = (error: mongoose.Error.CastError) => {
  const errors: IGenericErrorMessage[] = [
    {
      path: error.path,
      message: 'Invalid Id',
    },
  ];

  return {
    statusCode: 400,
    message: 'Cast Error',
    errorMessages: errors,
  };
};

export default handleCastError;

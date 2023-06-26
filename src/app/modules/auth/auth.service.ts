import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { ILoginUser, IUserLoginResponse } from './auth.interface,';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';

const loginUser = async (payload: ILoginUser): Promise<IUserLoginResponse> => {
  const { id, password } = payload;

  //for instance method
  //   const user = new User();
  //   const isUserExist = await user.isUserExist(id);

  //check user using statics
  const isUserExist = await User.isUserExist(id);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  const {
    id: userId,
    password: savedPassword,
    role,
    passwordChange,
  } = isUserExist;

  //check password
  if (!(await User.isPasswordMatched(password, savedPassword))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //create access token
  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  //create refresh token
  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    passwordChange,
  };
};

export const AuthService = {
  loginUser,
};

import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import {
  IChangePassword,
  ILoginUser,
  IRefreshTokenResponse,
  IUserLoginResponse,
} from './auth.interface,';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { JwtPayload, Secret } from 'jsonwebtoken';

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
    passwordChanged,
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
    passwordChanged,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;

  //verify refresh token
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }
  const { userId } = verifiedToken;

  //check user
  const isUserExist = await User.isUserExist(userId);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  //generate new access token
  const newAccessToken = jwtHelpers.createToken(
    {
      userId: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

//using update method
// const changePassword = async (
//   user: JwtPayload | null,
//   payload: IChangePassword
// ): Promise<void> => {
//   const { oldPassword, newPassword } = payload;

//   //check user
//   const isUserExist = await User.isUserExist(user?.userId);
//   if (!isUserExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
//   }

//   //check password
//   if (!(await User.isPasswordMatched(oldPassword, isUserExist.password))) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
//   }

//   //hash password before update
//   const newHashedPassword = await bcrypt.hash(
//     newPassword,
//     Number(config.bcrypt_salt_rounds)
//   );

//   const updatedData = {
//     password: newHashedPassword,
//     passwordChanged: true,
//     passwordChangedAt: new Date(),
//   };

//   await User.findOneAndUpdate({ id: user?.userId }, updatedData);
// };

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  //check user
  const isUserExist = await User.findOne({ id: user?.userId }).select(
    '+password'
  );
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  //check password
  if (!(await User.isPasswordMatched(oldPassword, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  // data update
  isUserExist.password = newPassword;
  isUserExist.passwordChanged = true;

  isUserExist.save();
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
};

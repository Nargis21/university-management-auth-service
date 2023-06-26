import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { ILoginUser } from './auth.interface,';

const loginUser = async (payload: ILoginUser) => {
  const { id, password } = payload;

  //for instance method
  //   const user = new User();
  //   const isUserExist = await user.isUserExist(id);

  //check user using statics
  const isUserExist = await User.isUserExist(id);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  //check password
  if (!(await User.isPasswordMatched(password, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }
};

export const AuthService = {
  loginUser,
};

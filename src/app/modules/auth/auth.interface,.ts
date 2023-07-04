export type ILoginUser = {
  id: string;
  password: string;
};

export type IUserLoginResponse = {
  accessToken: string;
  refreshToken?: string;
  passwordChanged: boolean;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};

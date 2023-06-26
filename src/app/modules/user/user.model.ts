/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from 'mongoose';
import { IUser, IUserMethods, UserModel } from './user.interface';
import config from '../../../config';
import bcrypt from 'bcrypt';
// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser, object, IUserMethods>(
  {
    id: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    password: { type: String, required: true, select: 0 },
    passwordChange: { type: Boolean, default: false },
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    faculty: { type: Schema.Types.ObjectId, ref: 'Faculty' },
    admin: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.methods.isUserExist = async function (
  id: string
): Promise<Partial<IUser> | null> {
  return await User.findOne({ id }, { id: 1, password: 1, passwordChange: 1 });
};

userSchema.methods.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.pre('save', async function (next) {
  //hash password
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

export const User = model<IUser, UserModel>('User', userSchema);

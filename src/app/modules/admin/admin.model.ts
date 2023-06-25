import { Schema, model } from 'mongoose';
import { AdminModel, IAdmin } from './admin.interface';
import { ManagementDepartment } from '../managementDepartment/managementDepartment.model';
import { bloodGroup, gender } from './admin.constant';

const AdminSchema = new Schema<IAdmin, AdminModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
        },
        middleName: {
          type: String,
        },
      },
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    contactNo: {
      type: String,
      unique: true,
      required: true,
    },
    emergencyContactNo: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: gender,
      required: true,
    },
    permanentAddress: {
      type: String,
      required: true,
    },
    presentAddress: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: bloodGroup,
    },
    designation: {
      type: String,
      required: true,
    },
    managementDepartment: {
      type: Schema.Types.ObjectId,
      ref: ManagementDepartment,
      required: true,
    },
    profileImage: {
      type: String,
      // required: true
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Admin = model<IAdmin, AdminModel>('Admin', AdminSchema);

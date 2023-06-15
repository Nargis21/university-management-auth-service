import { Schema, Types, model } from 'mongoose';
import {
  AcademicDepartmentModel,
  IAcademicDepartment,
} from './academicDepartment.interface';

const AcademicDepartmentSchema = new Schema<IAcademicDepartment>(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    academicFaculty: {
      type: Types.ObjectId,
      ref: 'AcademicFaculty',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const AcademicDepartment = model<
  IAcademicDepartment,
  AcademicDepartmentModel
>('AcademicDepartment', AcademicDepartmentSchema);

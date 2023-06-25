import { Model, Types } from 'mongoose';
import { IManagementDepartment } from '../managementDepartment/managementDepartment.interface';

type UserName = {
  firstName: string;
  middleName?: string;
  lastName?: string;
};

export type IAdmin = {
  id: string;
  name: UserName;
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  gender: 'Male' | 'Female';
  permanentAddress: string;
  presentAddress: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  designation: string;
  managementDepartment: Types.ObjectId | IManagementDepartment;
  profileImage?: string;
};

export type IAdminFilters = {
  searchTerm?: string;
  id?: string;
  email?: string;
  contactNo?: string;
  emergencyContactNo?: string;
  gender?: 'Male' | 'Female';
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  managementDepartment?: string;
  designation?: string;
};

export type AdminModel = Model<IAdmin, object>;

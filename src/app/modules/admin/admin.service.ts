import { SortOrder, startSession } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericPaginationResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { adminSearchableFields } from './admin.constant';
import { IAdmin, IAdminFilters } from './admin.interface';
import { Admin } from './admin.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';

const getAllAdmins = async (
  filters: IAdminFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericPaginationResponse<IAdmin[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: adminSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Admin.find(whereCondition)
    .populate('managementDepartment')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
  const total = await Admin.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAdminById = async (id: string): Promise<IAdmin | null> => {
  const result = await Admin.findById(id).populate('managementDepartment');
  return result;
};

const updateAdmin = async (
  id: string,
  payload: Partial<IAdmin>
): Promise<IAdmin | null> => {
  const isExist = await Admin.findOne({ id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  const { name, ...adminData } = payload;
  const updatedAdminData = { ...adminData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IAdmin>;
      (updatedAdminData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Admin.findOneAndUpdate({ id }, updatedAdminData, {
    new: true,
  }).populate('managementDepartment');
  return result;
};

const deleteAdmin = async (id: string): Promise<IAdmin | null> => {
  const isExist = await Admin.findOne({ id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }
  const session = await startSession();
  try {
    session.startTransaction();
    const admin = await Admin.findOneAndDelete({ id }, { session });

    if (!admin) {
      throw new ApiError(404, 'Failed to delete admin');
    }

    const user = await User.findOneAndDelete({ id }, { session });
    if (!user) {
      throw new ApiError(404, 'Failed to delete user');
    }
    session.commitTransaction();
    session.endSession();
    return admin;
  } catch (err) {
    session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const AdminService = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};

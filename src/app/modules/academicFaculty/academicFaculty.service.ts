import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericPaginationResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { academicFacultySearchableFields } from './academicFaculty.constant';
import {
  IAcademicFaculty,
  IAcademicFacultyFilters,
} from './academicFaculty.interface';
import { AcademicFaculty } from './academicFaculty.model';

const createFaculty = async (
  payload: IAcademicFaculty
): Promise<IAcademicFaculty> => {
  const result = await AcademicFaculty.create(payload);
  return result;
};

const getAllFaculties = async (
  filters: IAcademicFacultyFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericPaginationResponse<IAcademicFaculty[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: academicFacultySearchableFields.map(field => ({
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

  const result = await AcademicFaculty.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
  const total = await AcademicFaculty.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getFacultyById = async (
  payload: string
): Promise<IAcademicFaculty | null> => {
  const result = await AcademicFaculty.findById(payload);
  return result;
};

const updateFaculty = async (
  id: string,
  payload: Partial<IAcademicFaculty>
): Promise<IAcademicFaculty | null> => {
  const result = await AcademicFaculty.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteFaculty = async (id: string): Promise<IAcademicFaculty | null> => {
  const result = await AcademicFaculty.findByIdAndDelete(id);
  return result;
};

export const AcademicFacultyService = {
  createFaculty,
  getAllFaculties,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
};

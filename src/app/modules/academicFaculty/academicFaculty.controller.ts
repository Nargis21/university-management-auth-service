import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IAcademicFaculty } from './academicFaculty.interface';
import httpStatus from 'http-status';
import { AcademicFacultyService } from './academicFaculty.service';
import { academicFacultyFilterableFields } from './academicFaculty.constant';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';

const createFaculty = catchAsync(async (req: Request, res: Response) => {
  const { ...facultyData } = req.body;
  const result = await AcademicFacultyService.createFaculty(facultyData);
  sendResponse<IAcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic faculty is created successfully',
    data: result,
  });
});

const getAllFaculty = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, academicFacultyFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await AcademicFacultyService.getAllFaculty(
    filters,
    paginationOptions
  );
  sendResponse<IAcademicFaculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const AcademicFacultyController = {
  createFaculty,
  getAllFaculty,
};

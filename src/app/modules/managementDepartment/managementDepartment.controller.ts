import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IManagementDepartment } from './managementDepartment.interface';
import { Request, Response } from 'express';
import { ManagementDepartmentService } from './managementDepartment.service';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { managementDepartmentFilterableFields } from './managementDepartment.constant';

const createManagementDepartment = catchAsync(
  async (req: Request, res: Response) => {
    const { ...managementDepartmentData } = req.body;
    const result = await ManagementDepartmentService.createManagementDepartment(
      managementDepartmentData
    );
    sendResponse<IManagementDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Management department is created successfully',
      data: result,
    });
  }
);

const getAllManagementDepartments = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, managementDepartmentFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    const result =
      await ManagementDepartmentService.getAllManagementDepartments(
        filters,
        paginationOptions
      );
    sendResponse<IManagementDepartment[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Management departments retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getManagementDepartmentById = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result =
      await ManagementDepartmentService.getManagementDepartmentById(id);
    sendResponse<IManagementDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Management Department retrieved successfully',
      data: result,
    });
  }
);

const updateManagementDepartment = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = req.body;
    const result = await ManagementDepartmentService.updateManagementDepartment(
      id,
      updatedData
    );
    sendResponse<IManagementDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Management Department updated successfully',
      data: result,
    });
  }
);

const deleteManagementDepartment = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await ManagementDepartmentService.deleteManagementDepartment(
      id
    );
    sendResponse<IManagementDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Management Department deleted successfully',
      data: result,
    });
  }
);

export const ManagementDepartmentController = {
  createManagementDepartment,
  getAllManagementDepartments,
  getManagementDepartmentById,
  updateManagementDepartment,
  deleteManagementDepartment,
};

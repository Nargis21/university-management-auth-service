import express from 'express';
import { ManagementDepartmentController } from './managementDepartment.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ManagementDepartmentValidation } from './managementDepartment.validation';

const router = express.Router();

router.post(
  '/create-management',
  validateRequest(
    ManagementDepartmentValidation.createManagementDepartmentZodSchema
  ),
  ManagementDepartmentController.createManagementDepartment
);

router.get('/:id', ManagementDepartmentController.getManagementDepartmentById);

router.patch(
  '/:id',
  validateRequest(
    ManagementDepartmentValidation.updateManagementDepartmentZodSchema
  ),
  ManagementDepartmentController.updateManagementDepartment
);

router.delete(
  '/:id',
  ManagementDepartmentController.deleteManagementDepartment
);

router.get('/', ManagementDepartmentController.getAllManagementDepartments);

export const ManagementDepartmentRoutes = router;

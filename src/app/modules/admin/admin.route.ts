import express from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidation } from './admin.validation';
const router = express.Router();

router.get('/:id', AdminController.getAdminById);

router.patch(
  '/:id',
  validateRequest(AdminValidation.updateAdminZodSchema),
  AdminController.updateAdmin
);

router.delete('/:id', AdminController.deleteAdmin);

router.get('/', AdminController.getAllAdmins);

export const AdminRoutes = router;

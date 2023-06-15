import { z } from 'zod';

const createAcademicDepartmentZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    academicFaculty: z.string({
      required_error: 'Academic faculty is required',
    }),
  }),
});

export const AcademicDepartmentValidation = {
  createAcademicDepartmentZodSchema,
};

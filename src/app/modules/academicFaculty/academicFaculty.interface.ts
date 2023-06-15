import { Model } from 'mongoose';

export type IAcademicFaculty = {
  title: string;
};

export type IAcademicFacultyFilters = {
  searchTerm?: string;
  title?: string;
};

export type AcademicFacultyModel = Model<IAcademicFaculty, object>;

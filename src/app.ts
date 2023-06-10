import express, { Application } from 'express';
import cors from 'cors';
const app: Application = express();
import config from './config/index';

import { UserRoutes } from './app/modules/user/user.route';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { AcademicSemesterRoutes } from './app/modules/academicSemester/academicSemester.route';
// import ApiError from './errors/ApiError'

app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Application routes
app.use('/api/v1/user', UserRoutes);
app.use('/api/v1/academic-semester', AcademicSemesterRoutes);

console.log(app.get('env'));
console.log(config.node_env);

//Testing
// app.get('/', (req: Request, res: Response, next: NextFunction) => {
//   // res.send('Working Successfully')
//   // throw new Error()
//   // throw new ApiError(400, 'Custom Message')
//   // next('Next Custom Error') //count as error
//   // Promise.reject(new Error('Unhandled Promise Rejection'))
// })

//global error handler -- this is for synchronous api request
app.use(globalErrorHandler);

export default app;

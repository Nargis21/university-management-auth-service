import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
const app: Application = express();
import config from './config/index';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';
import httpStatus from 'http-status';
// import ApiError from './errors/ApiError'

app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Application routes
app.use('/api/v1', routes);

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

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [{ path: req.originalUrl, message: 'API Not Found' }],
  });
  next();
});

// const academicSemester = {
//   code: '02',
//   year: '2023',
// };
// const testId = async () => {
//   const testId = await generateStudentId(academicSemester);
//   console.log(testId);
// };
// testId();

export default app;

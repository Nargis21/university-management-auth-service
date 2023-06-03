import express, { Application, Request, Response } from 'express'
import cors from 'cors'
const app: Application = express()

import userRouter from './app/modules/user/user.route'

app.use(cors())

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Application routes
app.use('/api/v1/user', userRouter)

//Testing
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

export default app

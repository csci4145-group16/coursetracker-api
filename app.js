import express from 'express'
import cors from 'cors'
import * as awsServerlessExpressMiddleware from 'aws-serverless-express/middleware.js'
import 'dotenv/config'

import './src/db/dynamo.js'

import authRoute from './src/routes/auth.js'
import userRoute from './src/routes/user.js'
import schoolsRoute from './src/routes/schools.js'
import coursesRoute from './src/routes/courses.js'

// declare a new express app
const app = express()
const { PORT = 4000 } = process.env

// middlewares
app.use(express.json())
app.use(cors())
if (process.env.NODE_ENV === 'production')
  app.use(awsServerlessExpressMiddleware.eventContext())

app.get('/api', (_req, res) => {
  res.send('<h1>Welcome to the CourseTracker API!</h1>')
})

// routes
app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/schools', schoolsRoute)
app.use('/api/courses', coursesRoute)

app.listen(PORT, () => {
  console.log(`App runnning on http://localhost:${PORT}/api`)
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
export default app

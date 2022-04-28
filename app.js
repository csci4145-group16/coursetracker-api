import serverless from 'serverless-http'
import express from 'express'
import cors from 'cors'
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
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

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

export const handler = serverless(app)

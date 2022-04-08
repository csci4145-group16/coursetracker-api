import express from 'express'
import Cognito from '../cognito/Cognito.js'
import verifyToken from '../middlewares/verifyToken.js'
import Course from '../models/Course.js'
import User from '../models/User.js'
import { identityServiceProvider } from '../middlewares/verifyToken.js'

const router = express.Router()

// get current user
router.get('/', verifyToken, async (req, res) => {
  const AccessToken = req.headers.authorization
  const { id } = req.user
  try {
    const user = await User.get(id)
    res.json({ user, AccessToken })
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})

// get current user's courses
router.get('/courses', verifyToken, async (req, res) => {
  const { id } = req.user
  try {
    const user = await User.get(id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.courseIds.length === 0) return res.json([])
    const courses = await Course.batchGet(user.courseIds)
    res.json(courses)
  } catch (err) {
    console.error(err)
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body
  try {
    const cognito = new Cognito()
    const { AuthenticationResult } = await cognito.refreshTokens(refreshToken)
    const { AccessToken } = AuthenticationResult

    const rawUser = await identityServiceProvider
      .getUser({ AccessToken })
      .promise()

    const email = rawUser.UserAttributes.find(
      (attr) => attr.Name === 'email'
    )?.Value

    res.json({ AccessToken, email })
  } catch (err) {
    console.error(err)
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})

export default router

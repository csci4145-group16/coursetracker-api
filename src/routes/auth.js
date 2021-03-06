import express from 'express'
import Cognito from '../cognito/Cognito.js'
import User from '../models/User.js'
import AWS from 'aws-sdk'

const { CognitoIdentityServiceProvider } = AWS

export const identityServiceProvider = new CognitoIdentityServiceProvider({
  region: 'us-east-1',
})

const router = express.Router()

// sign up a user
router.post('/signup', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ message: 'Email and Password are required' })
  try {
    const cognito = new Cognito()
    const { UserSub: id } = await cognito.signUp(email, password)
    const newUser = new User({ id })
    await newUser.save()
    res.status(200).end()
  } catch (err) {
    console.error(err)
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})

// sign in a user
router.post('/signin', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ message: 'Email and Password are required' })
  try {
    const cognito = new Cognito()
    const { AuthenticationResult } = await cognito.signIn(email, password)
    const { AccessToken, RefreshToken } = AuthenticationResult
    const rawUser = await identityServiceProvider
      .getUser({ AccessToken })
      .promise()
    const id = rawUser.UserAttributes.find((attr) => attr.Name === 'sub')?.Value
    const userExists = await User.get(id)
    if (!userExists) {
      const newUser = new User({ id })
      await newUser.save()
    }

    res.json({ AccessToken, RefreshToken })
  } catch (err) {
    console.error(err)
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})

export default router

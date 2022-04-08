import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import School from '../models/School.js'
import User from '../models/User.js'

const router = express.Router()

// get all schools
router.get('/', async (_req, res) => {
  try {
    const schools = await School.scan().exec()
    res.json(schools)
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})

// get all schools that start with a letter
router.get('/:letter', async (req, res) => {
  const { letter } = req.params
  if (!letter)
    return res
      .status(400)
      .json({ message: 'No first letter provided to search for.' })
  else if (letter.length > 1)
    return res
      .status(400)
      .json({ message: 'Search letter cannot be longer that one letter.' })

  try {
    const schools = await School.scan('name')
      .beginsWith(letter.toUpperCase())
      .or()
      .where('name')
      .beginsWith(letter.toLowerCase())
      .exec()

    res.json(schools)
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})

// join a school
router.post('/', verifyToken, async (req, res) => {
  const { id: userId } = req.user
  const { name } = req.body
  if (!name) return res.status(400).json({ message: "'Name' must be present." })
  try {
    let school = await School.get(name)
    if (!school) {
      const newSchool = new School({ name })
      school = await newSchool.save()
    }
    const user = await User.get(userId)
    user.school = school.name
    await user.save()
    res.json(school)
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})

export default router

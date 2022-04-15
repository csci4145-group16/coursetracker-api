import express from 'express'
import Course from '../models/Course.js'
import verifyToken from '../middlewares/verifyToken.js'
import User from '../models/User.js'
import School from '../models/School.js'
import Task from '../models/Task.js'

const router = express.Router()

// get all courses
router.get('/', async (_req, res) => {
  try {
    const courses = await Course.scan().all().exec()
    res.json(courses)
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})

// get all courses that start with a letter
router.get('/search/:letter', async (req, res) => {
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
    const courses = await Course.scan('name')
      .beginsWith(letter.toUpperCase())
      .or()
      .where('name')
      .beginsWith(letter.toLowerCase())
      .exec()

    res.json(courses)
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})

// create a course
router.post('/', verifyToken, async (req, res) => {
  const { id } = req.user
  const { course } = req.body
  try {
    const newCourse = new Course(course)
    const savedCourse = await newCourse.save()

    console.log(savedCourse.id)

    const u = await User.update(
      { id },
      {
        $ADD: { courseIds: savedCourse.id },
      }
    )

    if (savedCourse.school) {
      const school = await School.get(savedCourse.school)
      if (school) {
        await School.update(
          { name: school.name },
          { $ADD: { courseIds: savedCourse.id } }
        )
      }
    }

    res.json(savedCourse.id)
  } catch (err) {
    console.error(err)
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})

// Join a course
router.post('/:courseId/join', verifyToken, async (req, res) => {
  const { id } = req.user
  const { courseId } = req.params
  try {
    const user = await User.get(id)
    if (user.courseIds.includes(courseId))
      return res.status(400).json({ message: 'User already in this course.' })

    const course = await Course.get(courseId)
    if (!course) return res.status(404).json({ message: 'Course not found.' })

    await User.update(
      { id },
      {
        $ADD: { courseIds: courseId },
      }
    )

    res.json(courseId)
  } catch (err) {
    console.error(err)
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})

// Get a course
router.get('/:courseId', verifyToken, async (req, res) => {
  const { id } = req.user
  const { courseId } = req.params
  try {
    const user = await User.get(id)
    if (!user.courseIds.includes(courseId))
      return res.status(400).json({ message: 'User not part of this course.' })

    const course = await Course.get(courseId)
    if (!course) return res.status(404).json({ message: 'Course not found.' })

    const tasks = await Task.scan().where('courseId').eq(courseId).exec()

    res.json({ course, tasks })
  } catch (err) {
    console.error(err)
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})

export default router

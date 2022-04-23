import express from 'express'
import Course from '../models/Course.js'
import verifyToken from '../middlewares/verifyToken.js'
import User from '../models/User.js'
import School from '../models/School.js'
import tasksRoute from './tasks.js'
import paginatedSearchResults from '../utils/paginatedSearchResults.js'

const router = express.Router()

router.use('/:courseId/:segment/tasks', verifyToken, async (req, res, next) => {
  const { courseId, segment } = req.params
  if (!courseId)
    return res.status(400).json({ message: 'No course id provided.' })
  if (!segment) return res.status(400).json({ message: 'No segment provided.' })
  try {
    const { id: userId } = req.user
    const user = await User.get(userId)
    if (!user) return res.status(400).json({ message: 'No user found.' })
    if (!user.courseIds.includes(courseId))
      return res.status(400).json({ message: 'User not part of this course.' })
    req.courseId = courseId
    req.segment = segment
    next()
  } catch (err) {
    console.log(err)
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})
router.use('/:courseId/:segment/tasks', tasksRoute)

// get all courses
router.get('/', async (_req, res) => {
  try {
    const courses = await Course.scan().all().exec()
    res.json(courses)
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})

router.get('/search', verifyToken, async (req, res) => {
  const { id } = req.user
  const startAt = req.query.startAt
  const limit = parseInt(req.query.limit)
  let results
  try {
    const { school } = await User.get(id)
    if (school)
      results = await Course.query('school')
        .eq(school)
        .sort('descending')
        .limit(limit)
        .startAt(startAt)
        .exec()
    else {
      const currentYear = new Date().getFullYear()
      results = await Course.query('year')
        .eq(currentYear)
        .limit(limit)
        .startAt(startAt)
        .exec()
    }
    res.json({ results })
  } catch (err) {
    console.error(err)
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})

// search courses with pagination
router.get('/search/:val', async (req, res) => {
  const { val } = req.params
  const startAt = req.query.startAt
  const limit = parseInt(req.query.limit)
  try {
    const paginatedResults = await paginatedSearchResults(
      Course,
      'searchName',
      val,
      startAt,
      limit
    )
    res.json(paginatedResults)
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})

// create a course
router.post('/', verifyToken, async (req, res) => {
  const { id } = req.user
  const { course } = req.body
  try {
    const newCourse = new Course({
      ...course,
      searchName: course.name.toLowerCase(),
      memberCount: 1,
    })
    const savedCourse = await newCourse.save()

    await User.update(
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
    await Course.update(
      { id: courseId },
      {
        $ADD: { memberCount: 1 },
      }
    )

    res.json(courseId)
  } catch (err) {
    console.error(err)
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})

// Get a course
router.get('/:courseId', async (req, res) => {
  const { courseId } = req.params
  try {
    const course = await Course.get(courseId)
    if (!course) return res.status(404).json({ message: 'Course not found.' })

    res.json(course)
  } catch (err) {
    console.error(err)
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})

export default router

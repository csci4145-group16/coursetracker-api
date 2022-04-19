import express from 'express'
import Task from '../models/Task.js'
import Course from '../models/Course.js'

const router = express.Router()

router.post('/', async (req, res) => {
  const courseId = req.courseId
  const segment = req.segment
  const { id: userId } = req.user

  const { title, grade } = req.body
  if (grade == null)
    return res.status(400).json({ message: 'No grade provided.' })

  try {
    const course = await Course.get(courseId)
    const segmentExists = course.segments.find((s) => s.name === segment)
    if (!segmentExists)
      return res
        .status(400)
        .json({ message: 'Segment does not exist on course.' })

    const task = new Task({
      title,
      grade,
      courseId,
      userId,
      segment,
    })
    const newTask = await task.save()
    res.json(newTask.id)
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})

router.put('/:taskId', async (req, res) => {
  const { taskId } = req.params
  const courseId = req.courseId
  const segment = req.segment

  const { title, grade } = req.body
  if (!grade) return res.status(400).json({ message: 'No grade provided.' })

  try {
    const course = await Course.get(courseId)
    const segmentExists = course.segments.find((s) => s.name === segment)
    if (!segmentExists)
      return res
        .status(400)
        .json({ message: 'Segment does not exist on course.' })

    const task = await Task.get(taskId)
    if (!task) return res.status(400).json({ message: 'No task found.' })
    task.grade = grade
    task.title = title
    await task.save()
    res.json(task.id)
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
})

export default router

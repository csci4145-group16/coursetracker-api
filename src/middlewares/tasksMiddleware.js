import User from '../models/User.js'

export default async (req, res, next) => {
  const { courseId, segmentId } = req.params
  if (!courseId)
    return res.status(400).json({ message: 'No course id provided.' })
  if (!segmentId)
    return res.status(400).json({ message: 'No segment id provided.' })
  try {
    const { id: userId } = req.user
    const user = await User.get(userId)
    if (!user) return res.status(404).json({ message: 'No user found.' })
    if (!user.courseIds.includes(courseId))
      return res.status(400).json({ message: 'User not part of this course.' })
    req.courseId = courseId
    req.segmentId = segmentId
    next()
  } catch (err) {
    console.log(err)
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
}

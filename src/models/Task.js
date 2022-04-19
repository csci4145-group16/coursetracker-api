import * as dynamoose from 'dynamoose'
import { v4 as uuid } from 'uuid'

export const taskSchema = new dynamoose.Schema(
  {
    id: {
      hashKey: true,
      type: String,
      required: true,
      default: () => uuid(),
    },
    title: String,
    grade: {
      type: Number,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    segment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
    },
  }
)

export default dynamoose.model('Task', taskSchema)

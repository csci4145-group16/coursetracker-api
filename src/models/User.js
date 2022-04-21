import * as dynamoose from 'dynamoose'
import { v4 as uuid } from 'uuid'

export const userSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
      required: true,
      default: () => uuid(),
    },
    school: String,
    courseIds: {
      type: Array,
      schema: [String],
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
    },
  }
)

const params =
  process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        create: false,
        waitForActive: false,
      }
    : {}

export default dynamoose.model('User', userSchema, params)

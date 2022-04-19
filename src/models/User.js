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

export default dynamoose.model('User', userSchema)

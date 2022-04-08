import * as dynamoose from 'dynamoose'

export const userSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
      required: true,
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

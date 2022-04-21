import * as dynamoose from 'dynamoose'

const schoolSchema = new dynamoose.Schema(
  {
    name: {
      type: String,
      hashKey: true,
      required: true,
    },
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

export default dynamoose.model('School', schoolSchema, params)

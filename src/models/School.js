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

export default dynamoose.model('School', schoolSchema)

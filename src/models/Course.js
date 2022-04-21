import * as dynamoose from 'dynamoose'
import { v4 as uuid } from 'uuid'

const segmentSchema = new dynamoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
})

export const courseSchema = new dynamoose.Schema(
  {
    id: {
      hashKey: true,
      type: String,
      required: true,
      default: () => uuid(),
    },
    name: {
      type: String,
      required: true,
    },
    searchName: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    segments: {
      type: Array,
      schema: [segmentSchema],
      required: true,
    },
    year: Number,
    term: {
      type: String,
      enum: ['Fall', 'Winter', 'Summer'],
    },
    instructor: String,
    school: String,
    userIds: {
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

export default dynamoose.model('Course', courseSchema, params)

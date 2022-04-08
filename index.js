import * as awsServerlessExpressMiddleware from 'aws-serverless-express'
import app from './app.js'

/**
 * @type {import('http').Server}
 */
const server = awsServerlessExpressMiddleware.createServer(app)

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`)
  return awsServerlessExpressMiddleware.proxy(server, event, context, 'PROMISE')
    .promise
}

import dynamoose from 'dynamoose'

dynamoose.aws.sdk.config.update({
  region: 'us-east-1',
})

// connect to aws account if in production
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  console.log('Configuring dynamoose for production')
  dynamoose.aws.sdk.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  })
} else {
  // defaults to http://localhost:8000
  console.log('Configuring dynamoose for development')
  dynamoose.aws.ddb.local()
}

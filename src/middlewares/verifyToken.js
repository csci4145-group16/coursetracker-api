import AWS from 'aws-sdk'

const { CognitoIdentityServiceProvider } = AWS

export const identityServiceProvider = new CognitoIdentityServiceProvider({
  region: 'us-east-1',
})

export default async (req, res, next) => {
  const AccessToken = req.headers.authorization
  try {
    const rawUser = await identityServiceProvider
      .getUser({ AccessToken })
      .promise()
    req.user = {
      id: rawUser.UserAttributes.find((attr) => attr.Name === 'sub')?.Value,
      email: rawUser.UserAttributes.find((attr) => attr.Name === 'email')
        ?.Value,
    }
    next()
  } catch (err) {
    console.error(err)
    res.status(err.statusCode || 500).json({ message: err.message || err })
  }
}

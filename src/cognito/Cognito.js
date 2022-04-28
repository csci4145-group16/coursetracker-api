import AWS from 'aws-sdk'
// import crypto from 'crypto'

class Cognito {
  config = {
    region: 'us-east-1',
  }
  clientId = process.env.COGNITO_CLIENT_ID
  // clientSecret = process.env.COGNITO_CLIENT_SECRET

  constructor() {
    this.cognito = new AWS.CognitoIdentityServiceProvider(this.config)
  }

  async signUp(email, password) {
    const params = {
      ClientId: this.clientId,
      Username: email,
      Password: password,
      // SecretHash: this.generateSecretHash(email),
    }
    try {
      return await this.cognito.signUp(params).promise()
    } catch (error) {
      console.error(error)
      const { code, statusCode } = error
      const message = this.getMessageFromErrorCode(code)
      throw { message, statusCode }
    }
  }

  async signIn(email, password) {
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        // SECRET_HASH: this.generateSecretHash(email),
      },
    }

    try {
      return await this.cognito.initiateAuth(params).promise()
    } catch (error) {
      console.error(error)
      const { code, statusCode } = error
      let message = this.getMessageFromErrorCode(code)
      throw { message, statusCode }
    }
  }

  async refreshTokens(refreshToken) {
    const params = {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
        // SECRET_HASH: this.generateSecretHash(email),
      },
    }

    try {
      return await this.cognito.initiateAuth(params).promise()
    } catch (error) {
      console.error(error)
      const { code, statusCode } = error
      let message = this.getMessageFromErrorCode(code)
      throw { message, statusCode }
    }
  }

  // USE THIS IF COGNITO HAS SECRET KEY
  // generateSecretHash(email) {
  //   return crypto
  //     .createHmac('SHA256', this.clientSecret)
  //     .update(email + this.clientId)
  //     .digest('base64')
  // }

  getMessageFromErrorCode(code) {
    switch (code) {
      case 'UsernameExistsException':
        return 'An account with this email already exists.'
      case 'InvalidParameterException':
        return 'There exists empty fields'
      case 'InvalidPasswordException':
        return 'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character.'
      case 'NotAuthorizedException':
        return 'Invalid email or password'
      case 'UserNotConfirmedException':
        return 'User is not confirmed'
      default:
        return 'Something went wrong'
    }
  }
}

export default Cognito

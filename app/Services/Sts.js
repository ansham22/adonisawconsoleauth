'use strict'

let Sts = exports = module.exports = {}
const endPoint = 'https://sts.amazonaws.com/'
const signInEndPoint = 'https://signin.aws.amazon.com/federation'
const got = use('got')
const querystring = use('querystring')

Sts.identify = function * (token, arn) {

  const options = {
    DurationSeconds: 900,
    Action  : 'AssumeRoleWithWebIdentity',
    Version : '2011-06-15',
    RoleSessionName: 'web-identity-federation',
    RoleArn : arn,
    WebIdentityToken: token
  }

  return yield got.get(endPoint, {query: options})

}

Sts.getSignInToken = function * (id, key, token) {

  const session = JSON.stringify({sessionId:id, sessionKey: key, sessionToken: token})

  const options = {
    Action: 'getSigninToken',
    Session: session
  }

  return yield got.get(signInEndPoint, {query: options})

}

Sts.getConsoleUrl = function (signInToken) {


  const optons = {
    SigninToken: signInToken,
    Issuer: 'http://localhost:3333/',
    Action: 'login',
    Destination: 'https://console.aws.amazon.com'
  }

  return `${signInEndPoint}?${querystring.stringify(optons)}`

}

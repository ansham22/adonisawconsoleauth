'use strict'

const querystring = use('querystring')
const got = use('got')

const requestEndPoint = 'https://accounts.google.com/o/oauth2/v2/auth'
const endPoint = 'https://www.googleapis.com/oauth2/v4/token'

let GoogleStrategy = exports = module.exports = {}

/**
 * @description generates redirect url to google ouath
 * api.
 * @param  {String} appId
 * @param  {String} redirectUri
 * @return {String}
 */
GoogleStrategy.redirect = function (appId, redirectUri) {

  const options = {
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid',
    client_id: appId
  }

  return `${requestEndPoint}?${querystring.stringify(options)}`
}

/**
 * @description makes http request to google to get access token
 * for given code
 * @param  {String} appId
 * @param  {String} appSecret
 * @param  {String} authCode
 * @param  {String} redirectUri
 * @return {Object}
 */
GoogleStrategy.getAccessToken = function * (appId, appSecret, authCode, redirectUri) {

  const options = {
    code: authCode,
    client_id: appId,
    client_secret: appSecret,
    redirect_uri: redirectUri,
    grant_type : 'authorization_code'
  }

  return yield got.post(endPoint, {body:options})
}

module.exports = GoogleStrategy

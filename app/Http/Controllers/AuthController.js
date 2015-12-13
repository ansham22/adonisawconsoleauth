'use strict'

const Config = use('Config')
const GoogleStrategy = use('App/Services/GoogleStrategy')
const Sts = use('App/Services/Sts')
const parser = use('xml2json')

class AuthController {

  constructor () {
    this.redirectUri = 'http://localhost:3333/oauth'
    this.appId = Config.get('social.google.APP_ID')
    this.domainId = Config.get('social.hd.DOMAIN_ID')
    this.appSecret = Config.get('social.google.APP_SECRET')
    this.stsArn = Config.get('social.sts.arn')
    this.emailIds = Config.get('security.emailIds')
  }

  * index (request, response) {
    const view = yield response.view('index')
    response.ok(view)
  }

  * initiate (request, response) {
    const url = GoogleStrategy.redirect(this.appId, this.redirectUri,this.domainId)
    response.redirect(url)
    }

  * callback (request, response) {
    const code = request.input('code')
    try {
      const googleResponse = yield GoogleStrategy.getAccessToken(this.appId, this.appSecret, code, this.redirectUri)
      const responseBody = JSON.parse(googleResponse.body)
      const profileResponse = yield GoogleStrategy.getEmailId(responseBody.access_token)
      if(!this.validateEmail(profileResponse)) {
        response.status(403).send('Not allowed')
        return
      }
      const stsXMLResponse = yield Sts.identify(responseBody.id_token, this.stsArn)
      const stsResponse = JSON.parse(parser.toJson(stsXMLResponse.body))
      console.log(stsResponse)
      const SessionId = stsResponse.AssumeRoleWithWebIdentityResponse.AssumeRoleWithWebIdentityResult.Credentials.AccessKeyId
      const SessionKey = stsResponse.AssumeRoleWithWebIdentityResponse.AssumeRoleWithWebIdentityResult.Credentials.SecretAccessKey
      const SessionToken = stsResponse.AssumeRoleWithWebIdentityResponse.AssumeRoleWithWebIdentityResult.Credentials.SessionToken
      console.log(SessionId,SessionKey,SessionToken)
      const stsSignInResponse = yield Sts.getSignInToken(SessionId, SessionKey, SessionToken)
      const awsUrl = Sts.getConsoleUrl(JSON.parse(stsSignInResponse.body).SigninToken)
      response.redirect(awsUrl)
    }catch (e) {
      console.log('e>>>', e)
      response.send(e.message)
    }
  }

  validateEmail (profile) {
    console.log(profile)
    const emailBody = JSON.parse(profile.body)
    const emailAddress = emailBody.data.email
    return this.emailIds.indexOf(emailAddress) > -1 ? emailAddress : false
  }

}

module.exports = AuthController

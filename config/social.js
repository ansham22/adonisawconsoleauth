const Env = use('Env')

module.exports = {

  google: {
    APP_ID: Env.get('GOOGLE_CLIENT_ID'),
    APP_SECRET: Env.get('GOOGLE_CLIENT_SECRET')
  },

  sts: {
    arn: Env.get('STS_ARN')
  }

}

// Authorizer policy
export const AUTH_PRINCIPAL_ID_POLICY = 'node-express-auth-policy';
export const AUTH_VERSION_POLICY = '2012-10-17';

export const PASSPORT_NAMESPACE = 'node-express-sso';
export const SUPPORT_IDP = {
  google: {
    authorizationURL: 'https://accounts.google.com/o/oauth2/v4/auth',
    tokenURL: 'https://www.googleapis.com/oauth2/v4/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v4/userinfo',
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://d17dt631lzwisd.cloudfront.net/auth/sso/callback'
  },
  facebook: {
    authorizationURL: 'https://www.example.com/oauth2/authorize',
    tokenURL: 'https://www.example.com/oauth2/token',
    userInfoUrl: '',
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/example/callback'
  }
}

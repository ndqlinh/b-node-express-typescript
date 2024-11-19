// Authorizer policy
export const AUTH_PRINCIPAL_ID_POLICY = 'node-express-auth-policy';
export const AUTH_VERSION_POLICY = '2012-10-17';

export const PASSPORT_NAMESPACE = 'node-express-sso';
export const SUPPORT_IDP = {
  google: {
    authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenURL: 'https://www.googleapis.com/oauth2/v4/token',
    userInfoURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    callbackURL: 'https://d17dt631lzwisd.cloudfront.net/api/auth/sso/callback',
    scope: 'email profile openid',
    state: true,
    skipUserProfile: false
  },
  facebook: {
    authorizationURL: 'https://www.facebook.com/v21.0/dialog/oauth',
    tokenURL: 'https://graph.facebook.com/v21.0/oauth/access_token',
    userInfoURL: 'https://graph.facebook.com/v16.0/me',
    profileFields: ['public_profile', 'email', 'user_birthday'],
    callbackURL: 'https://d17dt631lzwisd.cloudfront.net/api/auth/sso/callback'
  }
}

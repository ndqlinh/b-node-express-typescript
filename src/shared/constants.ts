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
    skipUserProfile: false,
  },
  line: {
    authorizationURL: 'https://access.line.me/oauth2/v2.1/authorize',
    tokenURL: 'https://api.line.me/oauth2/v2.1/token',
    userInfoURL: 'https://api.line.me/v2/profile',
    profileFields: ['profile', 'email', 'openid'],
    callbackURL: 'https://d17dt631lzwisd.cloudfront.net/api/auth/sso/callback',
  },
};

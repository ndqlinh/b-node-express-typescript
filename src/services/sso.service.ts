import OAuth2Strategy from 'passport-oauth2';
import { jwtDecode } from 'jwt-decode';

import { SUPPORT_IDP } from '@shared/constants';
// import { decodeToken } from '@shared/utils/jwt.util';
import SsmHelper from '@shared/helpers/ssm.helper';

export default class SsoService {
  private readonly ssmHelper: SsmHelper;

  constructor() {
    this.ssmHelper = new SsmHelper();
  }

  async callbackHandler(accessToken: string, refreshToken: string, params: any, profile: any, done: any) {
    try {
      let userProfile = profile || {};

      // Parse idToken to get user profile
      const idToken = params.id_token;
      if (idToken) {
        const user = jwtDecode(idToken) as any;
        userProfile = { ...userProfile, ...user };
      }

      // Get user profile from userInfoURL
      if (accessToken) {
        const response = await fetch(SUPPORT_IDP.google.userInfoURL, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const profile = await response.json();
        userProfile = { ...userProfile, ...profile };
      }

      return done(null, { ...userProfile });
    } catch (error) {
      done(error);
    }
  }

  async getStrategy(idp: 'google' | 'facebook') {
    if (idp === 'google') {
      const clientId = await this.ssmHelper.getParams('GoogleClientId');
      const clientSecret = await this.ssmHelper.getParams('GoogleClientSecret');
      const configuration = {
        ...SUPPORT_IDP.google,
        ...{
          clientID: clientId,
          clientSecret: clientSecret
        }
      };
      return new OAuth2Strategy(configuration, this.callbackHandler);
    } else {
      throw new Error('Unsupported IDP');
    }
  }

  async getUserProfile(accessToken: string) {
    const response = await fetch(SUPPORT_IDP.google.userInfoURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const profile = await response.json();
    return profile;
  }
}

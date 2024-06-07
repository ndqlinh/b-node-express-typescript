import OAuth2Strategy from 'passport-oauth2';
import { SUPPORT_IDP } from '@shared/constants';
import { decodeToken } from '@shared/utils/jwt.util';
import { Logger } from '@shared/helpers/logger.helper';

export default class SsoService {
  strategy: OAuth2Strategy;

  constructor() {
    this.strategy = new OAuth2Strategy(SUPPORT_IDP.google, this.callbackHandler);
  }

  async callbackHandler(accessToken: string, refreshToken: string, params: any, profile: any, done: any) {
    // Verify function implementation
    Logger.INFO('ACCESS TOKEN', accessToken);
    Logger.INFO('REFRESH TOKEN', refreshToken);
    Logger.INFO('PROFILE', profile);

    try {
      let userProfile = profile || {};

      // Parse idToken to get user profile
      const idToken = params.id_token;
      if (idToken) {
        const user = decodeToken(idToken) as any;
        userProfile = { ...userProfile, ...user };
      }

      // Get user profile from userInfoURL
      if (accessToken) {
        const user = await this.getUserProfile(accessToken);
        userProfile = { ...userProfile, ...user };
      }

      return done(null, { ...userProfile });
    } catch (error) {
      done(error);
    }
  }

  getStrategy() {
    return this.strategy;
  }

  async getUserProfile(accessToken: string) {
    const response = await fetch(SUPPORT_IDP.google.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const profile = await response.json();
    return profile;
  }
}

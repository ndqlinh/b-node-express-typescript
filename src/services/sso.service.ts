import OAuth2Strategy from 'passport-oauth2';
import { jwtDecode } from 'jwt-decode';

import { SUPPORT_IDP } from '@shared/constants';
import SsmHelper from '@shared/helpers/ssm.helper';

export default class SsoService {
  private readonly ssmHelper: SsmHelper;

  constructor() {
    this.ssmHelper = new SsmHelper();
  }

  async callbackHandler(
    idp: 'google' | 'line',
    accessToken: string,
    refreshToken: string,
    params: any,
    profile: any,
    done: any
  ) {
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
        const response = await fetch(SUPPORT_IDP[idp].userInfoURL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const profile = await response.json();
        userProfile = { ...userProfile, ...profile };
      }

      return done(null, { ...userProfile });
    } catch (error) {
      done(error);
    }
  }

  async getStrategy(idp: 'google' | 'line') {
    if (!SUPPORT_IDP[idp]) {
      throw new Error('Unsupported IDP');
    }

    const configurations: any = {
      ...SUPPORT_IDP[idp],
      ...{
        clientID:
          idp === 'google'
            ? await this.ssmHelper.getParams('GoogleClientId')
            : await this.ssmHelper.getParams('LineChannelId'),
        clientSecret:
          idp === 'google'
            ? await this.ssmHelper.getParams('GoogleClientSecret')
            : await this.ssmHelper.getParams('LineChannelSecret'),
      },
    };
    return new OAuth2Strategy(
      configurations,
      (
        accessToken: string,
        refreshToken: string,
        params: any,
        profile: any,
        done: any
      ) =>
        this.callbackHandler(
          idp,
          accessToken,
          refreshToken,
          params,
          profile,
          done
        )
    );
  }

  async getUserProfile(accessToken: string) {
    const response = await fetch(SUPPORT_IDP.google.userInfoURL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const profile = await response.json();
    return profile;
  }
}

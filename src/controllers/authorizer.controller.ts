import { Logger } from '@shared/helpers/logger.helper';
import { generateAllow, generateDeny } from '../shared/utils/policy.util';
import AuthService from '../services/auth.service';
import { Context } from 'aws-lambda';

export const handler = async (event: any, context: Context, callback): Promise<any> => {
  const auth = new AuthService();
  const { authorizationToken, methodArn } = event;
  const token = authorizationToken.split(' ')[1];
  let authResponse = null;

  try {
    const verifiedToken: any = await auth.verifyToken(token);
    Logger.INFO('Verified token', verifiedToken);
    authResponse = generateAllow(methodArn, {
      ownerId: verifiedToken.id,
      email: verifiedToken.email
    });
  } catch (error) {
    authResponse = generateDeny(methodArn);
  }

  Logger.INFO('AUTH_RESPONSE: ', authResponse);
  return authResponse;
};

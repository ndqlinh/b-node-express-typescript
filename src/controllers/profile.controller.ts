import { wrapper } from '@shared/handler';
import { BaseResponse } from '@shared/helpers/response.helper';
import ProfileService from '../services/profile.service';
import AuthService from '../services/auth.service';

const user = new ProfileService();
const auth = new AuthService();

export const getProfileDetail = wrapper(async (event: any, _context: any, callback) => {
  const authorizationHeader = event.headers['Authorization'] || event.headers['authorization'];
  const token = authorizationHeader.split(' ')[1];
  const decodedToken: any = await auth.verifyToken(token);
  const { email } = decodedToken;
  const profile = await user.findByEmail(email);

  return BaseResponse.toSuccess(profile);
});

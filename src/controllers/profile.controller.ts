import { BaseResponse } from '@shared/helpers/response.helper';
import ProfileService from '../services/profile.service';
import AuthService from '../services/auth.service';

const user = new ProfileService();
const auth = new AuthService();

export const getProfileDetail = async (event: any, _context: any, callback) => {
  const { email } = event;
  const profile = await user.findByEmail(email);

  return BaseResponse.toSuccess(profile);
};

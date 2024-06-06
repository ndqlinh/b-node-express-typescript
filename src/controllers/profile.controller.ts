import { BaseResponse } from '@shared/helpers/response.helper';
import ProfileService from '../services/profile.service';

const user = new ProfileService();

export const getProfileDetail = async (event: any, _context: any, callback) => {
  const { email } = event;
  const profile = await user.findByEmail(email);

  return BaseResponse.toSuccess(profile);
};

export const updateProfile = async (event: any, _context: any) => {
  const { email } = event;
  const updateData = event.body;
  const updateResult = await user.updateProfileByEmail(email, updateData);

  return BaseResponse.toSuccess(updateResult);
}

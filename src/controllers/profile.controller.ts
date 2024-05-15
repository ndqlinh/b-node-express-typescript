import { wrapper } from '@shared/handler';
import { BaseResponse } from '@shared/helpers/response.helper';
import ProfileService from '../services/profile.service';

const user = new ProfileService();

export const getProfileDetail = wrapper(async (event: any, _context: any, callback) => {
  const requestBody = event.body;
  const profile = await user.findByEmail(requestBody?.email);

  return BaseResponse.toSuccess(profile);
});

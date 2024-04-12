import Joi from 'joi';
import { AccountModel } from '../models/account.model';

export const AccountSchema: Joi.ObjectSchema<AccountModel> = Joi.object({
  id: Joi.string(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  gender: Joi.string(),
  dob: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string()
}).options({ allowUnknown: false });

export const AccountsSchema: Joi.ArraySchema<AccountModel[]> = Joi.array()
  .items(AccountSchema)
  .unique('email')
  .min(1)
  .max(10)
  .options({ allowUnknown: false });

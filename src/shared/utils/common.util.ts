import crypto from 'crypto';

export const generateHashEmail = (str: string) => {
  return crypto
    .createHash('md5')
    .update(str)
    .digest('hex')
    .substring(0, 10);
};

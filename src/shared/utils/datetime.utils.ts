/**
 *  Returns the current time in ISO format.
 *
 * @returns Current time in ISO format.
 */
export const getCurrentTime = () => {
  return new Date().toISOString();
};

import { AUTH_PRINCIPAL_ID_POLICY, AUTH_VERSION_POLICY } from '../constants';

export const generatePolicy = (effect: 'Allow' | 'Deny', resource: string, context?: any) => {
  return {
    principalId: AUTH_PRINCIPAL_ID_POLICY,
    policyDocument: {
      Version: AUTH_VERSION_POLICY,
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    },
    context: { ...context }
  };
};

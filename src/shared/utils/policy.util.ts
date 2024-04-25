import { AUTH_PRINCIPAL_ID_POLICY, AUTH_VERSION_POLICY } from '../constants';

export const generatePolicy = (effect: 'Allow' | 'Deny', resource: string, context?: any) => {
  const authResponse: any = {
    principalId: AUTH_PRINCIPAL_ID_POLICY,
    context: { ...context }
  };

  if (effect && resource) {
    const policyDocument: any = {
      Version: AUTH_VERSION_POLICY,
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    };
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};

export const generateAllow = (resource: string, context?: any) => {
  return generatePolicy('Allow', resource, context);
};

export const generateDeny = (resource: string, context?: any) => {
  return generatePolicy('Deny', resource, context);
}

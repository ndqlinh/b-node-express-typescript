import { AUTH_PRINCIPAL_ID_POLICY, AUTH_VERSION_POLICY } from '../constants';

export const generatePolicy = (effect: 'Allow' | 'Deny', resource: string, context?: any) => {
  const authResponse: any = {};

  authResponse.principalId = AUTH_PRINCIPAL_ID_POLICY;
  if (effect && resource) {
    const policyDocument: any = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne: any = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  // Optional output with custom properties of the String, Number or Boolean type.
  authResponse.context = {
    errorMessage: 'You are not authorized to access this resource',
  };

  return authResponse;
};

export const generateAllow = (resource: string, context?: any) => {
  return generatePolicy('Allow', resource, context);
};

export const generateDeny = (resource: string, context?: any) => {
  return generatePolicy('Deny', resource, context);
}

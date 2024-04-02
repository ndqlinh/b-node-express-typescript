import { lambdaFunctions } from '../../lambda';
import { LambdaFunction } from '../../lambda/lambda.helper';
import { ApigatewayResource } from '../api-resource.helper';

const resources = lambdaFunctions.reduce((resources: any, lambda: LambdaFunction) => {
  if (lambda.apiResourcePath) {
    if (!resources[lambda.apiResourcePath]) {
      resources[lambda.apiResourcePath] = [];
    }
    resources[lambda.apiResourcePath].push(lambda);
  }
  return resources;
}, {});

export const apiResources = Object.keys(resources).map((path: string) => {
  return new ApigatewayResource({
    path,
    funcs: resources[path]
  });
});

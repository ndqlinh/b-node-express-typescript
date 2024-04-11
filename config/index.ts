import 'dotenv/config';

const configByEnv = {
  local: {
    appIds: ['local'],
    profile: {
      accountId: '1234',
      region: 'ap-southeast-1'
    }
  },
  dev: {
    profile: {
      accounttId: '910693666650',
      region: 'ap-southeast-2'
    }
  }
};

export interface AppConfig {
  env: string;
  profile: { accountId: string; region: string };
  apiGateway: { name: string };
  apiAuthorizer: boolean;
  ssm: {
    restApiId: string;
    rootResourceId: string;
    tokenSecret: string;
  };
  dynamodb: {
    apiVersion: string;
    region: string;
    endpoint: string;
  };
}

export const getConfig = (env: string | undefined = process.env.ENVIRONMENT) => {
  if (!env) {
    throw new Error('Missing environment variables. Please pass in "ENVIRONMENT={env} your_command".');
  }

  const region = configByEnv[env].profile.region;
  const appConfig: AppConfig = {
    ...configByEnv[env],
    env,
    apiGateway: {
      name: 'NodeExpressRestApi'
    },
    apiAuthorizer: true,
    ssm: {
      restApiId: 'NodeExpressRestApiId',
      rootResourceId: 'NodeExpressRootResourceId',
      tokenSecret: 'NodeExpressTokenSecret'
    },
    dynamodb: {
      apiVersion: '2012-08-10',
      region,
      endpoint:
        env === 'local' ? 'http://host.docker.internal:8000' : `http://dynamodb.${region}.amazonaws.com`
    }
  };

  return appConfig;
};

export const appConfig = getConfig(process.env.ENVIRONMENT);

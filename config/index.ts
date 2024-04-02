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
      accounttId: '',
      region: 'ap-southeast-1'
    }
  },
  stg: {
    profile: {
      accounttId: '',
      region: 'ap-southeast-1'
    }
  },
  prd: {
    profile: {
      accounttId: '',
      region: 'ap-southeast-1'
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
      restApiId: `NodeExpressRestApiId`,
      rootResourceId: `NodeExpressRootResourceId`
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

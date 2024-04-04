# b-node-express-typescript
#### A boilerplate to build a node express server using typescript and deploy to AWS lambda

## Getting started
### 1. Infrastructure

<img width="619" alt="Screen Shot 2023-03-26 at 8 21 53 PM" src="https://user-images.githubusercontent.com/62642499/227778476-e921198f-a2f1-4fca-a90a-7b08dc04265a.png">

```
├── bin
│   ├── app.ts // Initialize Stacks
│   ├── development.ts // Initialize Stack for local
├── lib
│   ├── aws-resources
│   │   ├── apigateway
│   │   │   ├── resources/index.ts // Initialize API Gateway Resources
│   │   │   ├── *.ts // Define API Gateway Constructor, Utilities and Helper
│   │   ├── dynamodb
│   │   │   ├── *.ts // Define Dynamodb Constructor and Utilities
│   │   ├── lambda
│   │   │   ├── functions/*.ts // Define Lambda Functions
│   │   │   ├── index.ts // Rollup Lambda Functions
│   │   │   ├── *.ts // Define Lambda Constructor, Utilities and Helper
│   │   ├── policy-statement
│   │   │   ├── index.ts // Define custom policy statements
│   │   ├── ssm
│   │   │   ├── *.ts // Define SSM Parameters Store Utilities
│   ├── api-stack.ts // Initialize API Resources and Integrations
│   ├── dynamodb-stack.ts // Initialize DynamoDB Tables and Global Secondary Indexes
│   ├── base-stack.ts // Initialize API Gateway and API Authorizer Function
│   ├── lambda-stack.ts // Initialize Lambda Functions
│   ├── index.ts // Rollup Stacks
```

### 2. App Structure

```
├── src
│   ├── controllers
│   │   ├── **/*.ts // Handler functions
│   ├── repositories
│   │   ├── **/*.ts // Database access objects
│   ├── services
│   │   ├── **/*.ts // Logically functions
│   ├── shared
│   │   ├── **/*.ts // Common functions, Helper functions
│   ├── validations
│   │   ├── **/*.ts // Validation functions
│   ├── webhook
│   │   ├── **/*.ts // Define webhook for app
├── test
│   ├── **/*.ts // Unittest
```

## Development Guidelines

### Prerequisites
- NodeJS >= 20.x
- Npm
- AWS CDK v2
- Docker

### Setup and Run locally
Install dependencies:
```bash
npm install
```

Start your local dynamodb:
```bash
docker network create -d bridge sam-cli # one-time-only
docker-compose up -d
```
Create database by running scripts:
- Init tables:
```bash
sh script/init-db
```
- Clear your data in dynamodb:
```bash
sh script/clean-db
```
The environment variables are defined in the `.env` file. You must update the `.env` file as variable requirement
```bash
cp .env.example .env
```
Run your app in locally:
- Synth app and generate cloudfront template
```bash
npm run synth
```
- Start with your API
```bash
npm run local
```

### Limitation
Some AWS Services that does not support to execute locally:
- AWS API Gateway Authorizer

---

## Deployment Guidelines

> Setting up and deployment source code with Github action.
>
> Flow the workflow in `/.github/workflows/*`.

### Step 1: Setup AWS account in codebase
Modify variable of `configEnvs` for deployment account on AWS in `config/index.ts`
<details>
<summary>Setup your Account ID, Region</summary>

```js
const configsByEnv = {
  local: {
    appIds: ['local'],
    profile: {
      accountId: '1234',
      region: 'ap-southeast-1'
    }
  },
  dev: {
    profile: {
      accountId: <dev-aws-account-id>,
      region: <dev-aws-region>
    }
  },
  stg: {
    profile: {
      accountId: <stg-aws-account-id>,
      region: <stg-aws-region>
    }
  },
   prod: {
    profile: {
      accountId: <prod-aws-account-id>,
      region: <prod-aws-region>
    }
  }
};
```
</details>

### Step 2: Configuring a GitHub Action Role for GitHub Workflows
#### Add the Identity Provider to AWS and set up a Role Trust Policy , see [Configuring OpenID Connect in AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services#overview)

<details>
<summary>Edit your trusted policy:</summary>

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::<ACCOUNT-ID>:oidc-provider/token.actions.githubusercontent.com"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
                },
                "StringLike": {
                    "token.actions.githubusercontent.com:sub": "repo:<YOUR-ORG>/<YOUR-REPOSITORY>:ref:refs/tags/<PROJECT>-v*-<TAG-ENV>"
                }
            }
        }
    ]
}
```

Update the `PROJECT` with your project name as the same with github actions trigger and `TAG-ENV` with your environment tag. Modify `TAG-ENV` with:
- `alpha`: For development env
- `beta`: For staging env
- `release`: For production env

</details>

#### Configure the Role's Permissions

<details>
<summary>Here is a minimum set of permissions for the IAM role:</summary>

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Resource": "*",
      "Effect": "Allow",
       "Condition": {
        "ForAnyValue:StringEquals": {
          "iam:ResourceTag/aws-cdk:bootstrap-role": [
            "deploy",
            "lookup",
            "file-publishing",
            "image-publishing"
          ]
        }
      }
    }
  ]
}
```
</details>

### Step 3: Verify and Add environment variables to Github Actions Secret

#### Environment variable:
- `ENVIRONMENT`: Deployment environment (`local`, `dev`, `stg`, `prod`)
- `APP_DOMAIN`: A domain of your app (ex: `dev.st.vn`)
- .... and more based on your app

> Go to [Github > Settings > Actions secrets and variables > Repository secrets](https://github.com/ndqlinh/b-node-express-typescript/settings/secrets/actions) and Setup all environment secret needed in app

### Step 4: Start deployment backend app

Checkout to deployment branch
```bash
git checkout origin/<deployment-branch>
```

Create a tag
```bash
git tag <project>-vX.Y.Z-<env>
```

Push and deploy your app
```bash
git push origin <project>-vX.Y.Z-<env>
```

Waiting for deployment finished ... and go to next step

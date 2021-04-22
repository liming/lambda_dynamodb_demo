import type { AWS, AwsIamPolicyStatements } from '@serverless/typescript';

import { createUser, listUsers } from '@functions/users';

// Define IAM role statements for:
// 1. DynamoDB
const iamRoleStatement: AwsIamPolicyStatements = [
  {
    Effect: 'Allow',
    Action: [
      'dynamodb:Query',
      'dynamodb:Scan',
      'dynamodb:PutItem'
    ],
    Resource: {
      'Fn::GetAtt': ['UsersTable', 'Arn']
    }
  },
];

const serverlessConfiguration: AWS = {
  service: 'lambda-dynamo-rest',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    userTableName: 'users-table-${self:provider.stage}'
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    region: 'ap-southeast-2',
    runtime: 'nodejs14.x',
    stage: '${opt:stage, \'dev\'}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
    iam: {
      role: {
        statements: iamRoleStatement
      }
    }
  },
  functions: { createUser, listUsers },
  resources: {
    Resources: {
      UsersTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:custom.userTableName}',
          AttributeDefinitions: [
            { AttributeName: 'id', AttributeType: 'S' }
          ],
          KeySchema: [
            { AttributeName: 'id', KeyType: 'HASH' }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;

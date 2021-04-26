/**
 * The file define create user function
 */
import 'source-map-support/register';

import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';
import type { ValidatedEventAPIGatewayProxyEventHandler } from 'src/types/api-gateway';
import { formatJSONAPIErrorResponse, formatJSONAPIObjectResponse } from '@libs/json-response';
import { middyfy } from '@libs/middleware';

import schema from './schema';
import { UserModel } from './model';
import Constants from '@configs/constants';
import { AWSError } from 'aws-sdk/lib/error';
import { encryptPassword } from '@libs/encrypt-password';

/**
 * 
 * @param event **ValidatedAPIGatewayProxyEvent** this event must have a body defined by schema
 * @returns an object contains statusCode and new user definition
 */
const create: ValidatedEventAPIGatewayProxyEventHandler<typeof schema> = async (event) => {
  const { username, firstName, lastName, email, credentials } = event.body;

  try {
    // encrypt password
    const encryptedCredentials: string = await encryptPassword(credentials);
    const userId = uuid.v1();

    const newUser: UserModel = {
      id: userId,
      username,
      firstName,
      lastName,
      email,
      credentials: encryptedCredentials,
    };

    const createdUser = await saveUser(newUser);

    return formatJSONAPIObjectResponse({
      type: 'users',
      id: userId,
      attributes: createdUser
    }, 201);
  } catch (err) {
    return formatJSONAPIErrorResponse(err);
  }
}

// save user into database
const saveUser = (userItem: UserModel) => {
  const client: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient();

  return new Promise((resolve, reject) => {
    const transactItems: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput = {
      TransactItems: [
        {
          Put: {
            TableName: Constants.USER_TABLE,
            // check not exists before (no user with this ID)
            ConditionExpression: 'attribute_not_exists(#pk)',
            ExpressionAttributeNames: {
              '#pk': 'id',
            },
            // the attributes
            Item: userItem,
          },
        },
        {
          Put: {
            TableName: Constants.UNIQUES_TABLE,
            // check not exists before (no user with this email)
            ConditionExpression: 'attribute_not_exists(#pk)',
            ExpressionAttributeNames: {
              '#pk': 'value',
            },
            // the item attributes
            Item: {
              value: `UNIQUE#EMAIL:${userItem.email}`,
            },
          },
        },
        {
          Put: {
            TableName: Constants.UNIQUES_TABLE,
            // check not exists before (no user with this email)
            ConditionExpression: 'attribute_not_exists(#pk)',
            ExpressionAttributeNames: {
              '#pk': 'value',
            },
            // the item attributes
            Item: {
              value: `UNIQUE#USERNAME:${userItem.username}`,
            },
          },
        },
      ]
    };

    return client.transactWrite(transactItems, (err: AWSError) => {
      if (err) {
        return reject(err);
      }

      // remove credentials from the response
      const { credentials, ...newUser } = userItem;

      return resolve(newUser);
    });
  });
};


export const main = middyfy(create);

/**
 * The file define create user function
 */
import 'source-map-support/register';

import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as uuid from 'uuid';
import type { ValidatedEventAPIGatewayProxyEventHandler } from 'src/types/api-gateway';
import { formatErrorResponse, formatJSONResponse } from '@libs/json-response';
import { middyfy } from '@libs/middleware';

import schema from './schema';
import { UserModel } from './model';
import Constants from 'src/configs/constants';
import { AWSError } from 'aws-sdk/lib/error';

/**
 * 
 * @param event **ValidatedAPIGatewayProxyEvent** this event must have a body defined by schema
 * @returns an object contains statusCode and new user definition
 */
const create: ValidatedEventAPIGatewayProxyEventHandler<typeof schema> = async (event) => {
  const { username, firstName, lastName, email, credentials } = event.body;

  const newUser: UserModel = {
    id: uuid.v1(),
    username,
    firstName,
    lastName,
    email,
    credentials,
  };

  try {
    const createdUser = await saveUser(newUser);

    return formatJSONResponse({ data: createdUser });
  } catch (err) {
    return formatErrorResponse(err);
  }
}

// save user into database
const saveUser = (userItem: UserModel) => {
  const client: DocumentClient = new DocumentClient();

  return new Promise((resolve, reject) => {
    const transactItems: DocumentClient.TransactWriteItemsInput = {
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

      return resolve(userItem);
    });
  });
};


export const main = middyfy(create);

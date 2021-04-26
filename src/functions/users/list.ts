/**
 * The file defines list users function
 */

import * as AWS from 'aws-sdk';
import { middyfy } from "@libs/middleware";
import Constants from "@configs/constants";
import { formatJSONAPIErrorResponse, formatJSONAPIArrayResponse } from "@libs/json-response";
import { EventAPIGatewayProxyEventHandler } from 'src/types/api-gateway';
import { AWSError } from "aws-sdk/lib/error";
import { UserModel } from './model';

/**
 * 
 * @returns a lambda reponse
 */
const list: EventAPIGatewayProxyEventHandler = async () => {
  try {
    const users: UserModel[] = await listUsers();

    return formatJSONAPIArrayResponse(users.map(user => ({
      type: 'users',
      id: user.id,
      attributes: user
    })));
  } catch (err) {
    return formatJSONAPIErrorResponse(err);
  }
}

// query users from database
const listUsers = (): Promise<UserModel[]> => {
  const client: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient();
  const params: AWS.DynamoDB.DocumentClient.ScanInput = {
    TableName: Constants.USER_TABLE,
    // do not read credentials
    ProjectionExpression: 'id, username, email, firstName, lastName',
  };

  return new Promise((resolve, reject) => {
    client.scan(params, (err: AWSError, result: AWS.DynamoDB.DocumentClient.ScanOutput) => {
      if (err) {
        return reject(err);
      }

      return resolve(<UserModel[]> result.Items);
    });
  })
}

export const main = middyfy(list);
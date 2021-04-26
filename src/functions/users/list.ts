/**
 * The file defines list users function
 */

import * as AWS from 'aws-sdk';
import { middyfy } from "@libs/middleware";
import Constants from "@configs/constants";
import { formatErrorResponse, formatJSONResponse } from "@libs/json-response";
import { EventAPIGatewayProxyEventHandler } from 'src/types/api-gateway';
import { AWSError } from "aws-sdk/lib/error";

/**
 * 
 * @returns a lambda reponse
 */
const list: EventAPIGatewayProxyEventHandler = async () => {
  try {
    const users = await listUsers();

    return formatJSONResponse({ data: users });
  } catch (err) {
    return formatErrorResponse(err);
  }
}

// query users from database
const listUsers = () => {
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

      return resolve(result.Items);
    });
  })
}

export const main = middyfy(list);
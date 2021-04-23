/**
 * The file defines list users function
 */
import { APIGatewayProxyEvent } from "aws-lambda";
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { middyfy } from "@libs/middleware";
import Constants from "src/configs/constants";
import { formatErrorResponse, formatJSONResponse } from "@libs/json-response";
import { EventAPIGatewayProxyEventHandler } from 'src/types/api-gateway';
import { AWSError } from "aws-sdk/lib/error";

/**
 * 
 * @param event lambda event
 * @returns a lambda 
 */
const list: EventAPIGatewayProxyEventHandler = async (event: APIGatewayProxyEvent) => {
  // TODO: deal with query strings for search, pagination, etc...
  console.log(event.queryStringParameters);

  try {
    const users = await listUsers();

    return formatJSONResponse({ data: users });
  } catch (err) {
    return formatErrorResponse(err);
  }
}

// query users from database
const listUsers = () => {
  const client: DocumentClient = new DocumentClient();
  const params: DocumentClient.ScanInput = {
    TableName: Constants.USER_TABLE,
  };

  return new Promise((resolve, reject) => {
    client.scan(params, (err: AWSError, result: DocumentClient.ScanOutput) => {
      if (err) {
        return reject(err);
      }

      return resolve(result.Items);
    });
  })
}

export const main = middyfy(list);
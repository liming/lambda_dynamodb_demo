/**
 * Mock APIs from AWS SDK
 */

import * as AWS from "aws-sdk";
import type { Context } from "aws-lambda/handler"

export const mockAWSError = (message: string): AWS.AWSError => {
  return { message, name: 'mockError', code: '123', time: new Date() };
};

export const mockEncryptImp = (err?: Error) => (_, callback?: (err: AWS.AWSError | null, result: AWS.KMS.EncryptResponse) => void): any => {
  if (err) {
    callback(mockAWSError(err.message), null);
  }

  callback(null, { CiphertextBlob: 'anencryptkey' });
}

export const mockTransactWriteImp = (err?: Error) => (_, callback?: (err: AWS.AWSError | null, result: AWS.DynamoDB.DocumentClient.TransactWriteItemsOutput) => void): any => {
  if (err) {
    callback(mockAWSError(err.message), null);
  }

  callback(null, null);
}

export const mockScanImp = (err: Error, result: AWS.DynamoDB.DocumentClient.ScanOutput) => (_, callback?: (err: AWS.AWSError | null, result: AWS.DynamoDB.DocumentClient.ScanOutput) => void): any => {
  if (err) {
    callback(mockAWSError(err.message), null);
  }

  callback(null, result);
}

export const getHandlerContext = (): Context => {
  return {
    callbackWaitsForEmptyEventLoop: true,
    functionName: 'text',
    functionVersion: '1.0',
    invokedFunctionArn: 'test',
    memoryLimitInMB: '1mb',
    awsRequestId: '13dsdh3',
    logGroupName: 'empty',
    logStreamName: 'empty',
    getRemainingTimeInMillis: jest.fn(),
    done: jest.fn(),
    fail: jest.fn(),
    succeed: jest.fn()
  };
}

export const getHandlerEvent = (body?: any) => {
  if (!body) {
    return {};
  }

  return {
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body),
  }
}
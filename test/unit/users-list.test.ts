/**
 * Unit test for listing users
 */

import { APIGatewayProxyResult } from "aws-lambda";
import * as AWS from "aws-sdk";
import { mocked } from "ts-jest/dist/utils/testing";

import { main as listUsers } from '../../src/functions/users/list';
import { getHandlerContext, getHandlerEvent, mockScanImp } from "../mock/aws-sdk";

// mocking AWS services
jest.mock('aws-sdk', () => {
  // DynamoDB mock
  const mDocumentClient = { scan: jest.fn() };
  const mDynamoDB = { DocumentClient: jest.fn(() => mDocumentClient) };

  return { DynamoDB: mDynamoDB };
});

describe('List users', () => {
  const mDocumentClient = new AWS.DynamoDB.DocumentClient();

  beforeEach(() => {
    mocked(mDocumentClient.scan).mockClear();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('List all users', (done) => {
    const fakeResults = {
      Items: [
        {
          id: '418d0050-9e64-11eb-b6cb-41652c269bb4',
          firstName: 'Benjamin',
          lastName: 'Button',
          email: 'notarealbenjaminbutton@gmail.com',
        },
        {
          id: '418d0050-9e64-11eb-b6cb-41652c269bb4',
          firstName: 'Jason',
          lastName: 'Williams',
          email: 'notarealbenjaminbutton@gmail.com',
        },
      ],
    };

    mocked(mDocumentClient.scan).mockImplementationOnce(mockScanImp(fakeResults));

    listUsers(getHandlerEvent(), getHandlerContext(), (err, result: APIGatewayProxyResult) => {
      expect(err).toBeNull();
      expect(result).toBeTruthy();
      expect(result.statusCode).toEqual(200);
      expect(result.body).toBeTruthy();

      const { data: users } = JSON.parse(result.body);

      expect(users).toHaveLength(2);

      done();
    });
  });
});

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

    mocked(mDocumentClient.scan).mockImplementationOnce(mockScanImp(null, fakeResults));

    listUsers(getHandlerEvent(), getHandlerContext(), (err, result: APIGatewayProxyResult) => {
      expect(err).toBeNull();
      expect(result).toBeTruthy();
      expect(result.statusCode).toEqual(200);
      expect(result.body).toBeTruthy();

      const body = JSON.parse(result.body);

      expect(body).toHaveProperty('data');

      const { data } = body;

      expect(data).toHaveLength(2);
      expect(data[0].type).toEqual('users');
      expect(data[0].attributes.firstName).toEqual(fakeResults.Items[0].firstName);

      done();
    });
  });

  it('List all users with an exception', (done) => {
    mocked(mDocumentClient.scan).mockImplementationOnce(mockScanImp(new Error('An exception'), null));

    listUsers(getHandlerEvent(), getHandlerContext(), (err, result: APIGatewayProxyResult) => {
      expect(err).toBeNull();
      expect(result).toBeTruthy();
      expect(result.statusCode).toEqual(501);
      expect(result.body).toBeTruthy();

      const body = JSON.parse(result.body);

      expect(body).toHaveProperty('errors');
      expect(body.errors[0].status).toEqual(501);

      done();
    });
  });
});

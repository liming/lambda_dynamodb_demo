/**
 * Unit test for creating user
 */

import * as AWS from "aws-sdk";
import type { APIGatewayProxyResult } from "aws-lambda"

import { main as createUser } from '../../src/functions/users/create';
import { mocked } from 'ts-jest/dist/utils/testing';
import { mockEncryptImp, mockTransactWriteImp, getHandlerContext, getHandlerEvent } from '../mock/aws-sdk';

const newUser = {
  firstName: 'Benjamin',
  lastName: 'Button',
  username: 'bb2013',
  credentials: 'badpassword',
  email: 'notarealbenjaminbutton@gmail.com',
};

// mocking AWS services
// aws-sdk-mock has some limitations regarding to calling AWS API in a closure. Jest mock seems a better way to deal with it
// 
jest.mock('aws-sdk', () => {
  // KMS mock
  const mKMSInstance = {
    encrypt: jest.fn(),
  };

  const mKMS = jest.fn(() => mKMSInstance);

  // DynamoDB mock
  const mDocumentClient = { transactWrite: jest.fn(), scan: jest.fn() };
  const mDynamoDB = { DocumentClient: jest.fn(() => mDocumentClient) };

  return { KMS: mKMS, DynamoDB: mDynamoDB };
});

describe('Create user', () => {
  const mKMS = new AWS.KMS();
  const mDocumentClient = new AWS.DynamoDB.DocumentClient();

  beforeEach(() => {
    mocked(mKMS.encrypt).mockClear();
    mocked(mDocumentClient.transactWrite).mockClear();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('It should create a new user', (done) => {
    // mock encrypt and transactWrite API
    mocked(mKMS.encrypt).mockImplementationOnce(mockEncryptImp());
    mocked(mDocumentClient.transactWrite).mockImplementationOnce(mockTransactWriteImp());

    createUser(getHandlerEvent(newUser), getHandlerContext(), (err, result: APIGatewayProxyResult) => {
      expect(err).toBeNull();

      expect(result).toBeTruthy();
      expect(result.statusCode).toEqual(200);
      expect(result.body).toBeTruthy();

      const { data: user } = JSON.parse(result.body);

      expect(user).toHaveProperty('id');
      expect(user.firstName).toEqual(newUser.firstName);

      done();
    });
  });

  it('It should response with an exception from write action', (done) => {
    // mock encrypt and transactWrite API
    mocked(mKMS.encrypt).mockImplementationOnce(mockEncryptImp());
    mocked(mDocumentClient.transactWrite).mockImplementationOnce(mockTransactWriteImp(new Error('An exception')));

    createUser(getHandlerEvent(newUser), getHandlerContext(), (err, result: APIGatewayProxyResult) => {
      expect(err).toBeNull();

      expect(result).toBeTruthy();
      expect(result.statusCode).toEqual(501);

      done();
    });
  });

  it('It should response with an exception from encrypt action', (done) => {
    // mock encrypt and transactWrite API
    mocked(mKMS.encrypt).mockImplementationOnce(mockEncryptImp(new Error('An exception')));
    mocked(mDocumentClient.transactWrite).mockImplementationOnce(mockTransactWriteImp());

    createUser(getHandlerEvent(newUser), getHandlerContext(), (err, result: APIGatewayProxyResult) => {
      expect(err).toBeNull();

      expect(result).toBeTruthy();
      expect(result.statusCode).toEqual(501);

      done();
    });
  });
});

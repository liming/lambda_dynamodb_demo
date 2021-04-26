/**
 * This is the file declare user's lambda events
 */

import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

// Create user lambda event
// JSON schema validation with API gateway.
// @see https://www.serverless.com/framework/docs/providers/aws/events/apigateway/#request-schema-validators
const createUser = {
  handler: `${handlerPath(__dirname)}/create.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'users',
        request: {
          schemas: {
            'application/json': {
              schema,
              name: 'UserCreateModel',
              description: 'Validation model for creating user'
            }
          }
        },
        response: {
          headers: {
            'Content-Type': 'application/vnd.api+json'
          }
        }
      }
    }
  ]
}

// List users lambda event
const listUsers = {
  handler: `${handlerPath(__dirname)}/list.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'users',
        response: {
          headers: {
            'Content-Type': 'application/vnd.api+json'
          }
        }
      }
    }
  ]
}

export { createUser, listUsers };
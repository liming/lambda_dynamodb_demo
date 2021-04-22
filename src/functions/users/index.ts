import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';

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
        }
      }
    }
  ]
}

const listUsers = {
  handler: `${handlerPath(__dirname)}/list.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'users',
      }
    }
  ]
}

export { createUser, listUsers };
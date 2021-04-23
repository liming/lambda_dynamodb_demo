/**
 * 
 */
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }

/**
 * The interface that define lambda function handling Post/Put request, which would have request body be validated.
 * 
 * @example <caption>Define a lambda function</caption>
 * import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
 * import schema from './schema';
 * 
 * const create: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
 *   return {...}
 * }
 */
export type ValidatedEventAPIGatewayProxyEventHandler<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;

/**
 * This is a simple interface of a common lambda event handler
 */
export type EventAPIGatewayProxyEventHandler = Handler<APIGatewayProxyEvent, APIGatewayProxyResult>;
/**
 * The file has some useful methods to handle JSON response.
 */

import { AWSError } from "aws-sdk/lib/error"

/**
 * @param response Response body
 * @returns form the lambda function response
 */
export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}

/**
 * 
 * @param err An error object
 * @returns the lambda function error response
 */
export const formatErrorResponse = (err: AWSError) => {
  return {
    statusCode: err.statusCode || 501,
    body: err.message
  }
}
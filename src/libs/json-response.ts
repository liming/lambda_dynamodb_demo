/**
 * The file has some useful methods to handle JSON response.
 */

import { JSONAPIDataResponse } from "src/types/json-api"
import { AWSError } from "aws-sdk/lib/error"

/**
 * @param data the data of entity model
 * @returns form the lambda function response
 */
export const formatJSONAPIObjectResponse = (data: JSONAPIDataResponse, statusCode?: number) => {
  return {
    statusCode: statusCode || 200,
    body: JSON.stringify({
      data
    })
  }
}

export const formatJSONAPIArrayResponse = (dataArray: JSONAPIDataResponse[], statusCode?: number) => {
  return {
    statusCode: statusCode || 200,
    body: JSON.stringify({
      data: dataArray
    })
  }
}

/**
 * 
 * @param err An error object
 * @returns the lambda function error response
 */
export const formatJSONAPIErrorResponse = (err: AWSError) => {
  const statusCode = err.statusCode || 501;

  // TODO: find the error source
  return {
    statusCode,
    body: JSON.stringify({
      errors: [{
        status: statusCode,
        title: err.name,
        details: err.message
      }]
    })
  }
}
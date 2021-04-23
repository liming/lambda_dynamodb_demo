/**
 * The file defines some useful middlewares
 */

import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"

/**
 * 
 * @param handler a lambda function which can be "middified"
 * @returns 
 */
export const middyfy = (handler) => {
  // middyJsonBodyParser is to parse event body from a JSON string into object
  // @see https://middy.js.org/packages/http-json-body-parser/
  return middy(handler).use(middyJsonBodyParser())
}

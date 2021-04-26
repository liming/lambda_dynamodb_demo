/**
 * The types of JSON API response or request
 */

import { BaseModel } from "src/models/base-model";

export interface JSONAPIDataResponse {
  type: string,
  id: string,
  attributes: BaseModel
}
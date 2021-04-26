/**
 * Interface of user model
 */

import { BaseModel } from "src/models/base-model";

export interface UserModel extends BaseModel {
  username: string,
  email: string,
  credentials?: string,
  firstName: string,
  lastName: string
}
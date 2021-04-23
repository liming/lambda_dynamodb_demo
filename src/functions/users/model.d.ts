/**
 * Interface of user model
 */

export interface UserModel {
  id?: string,
  username: string,
  email: string,
  credentials?: string,
  firstName: string,
  lastName: string
}
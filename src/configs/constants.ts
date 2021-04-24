/**
 * The file defines some constants which need to be used across application
 */

export default class Constants {
  /**
   * DynamoDB table to save user attributes
   */
  static get USER_TABLE() {
    return process.env.USERS_TABLE;
  }

  /**
   * DynamoDB table for ensure unique values
   */
  static get UNIQUES_TABLE() {
    return process.env.UNIQUES_TABLE;
  }

  /**
   * Key used to encrypt password
   */
  static get ENCRYPTED_KEY() {
    return process.env.ENCRYPTED_KEY;
  }
}
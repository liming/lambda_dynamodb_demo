/**
 * The file defines some constants which need to be used across application
 */

export default class Constants {
  static get USER_TABLE() {
    return process.env.USERS_TABLE;
  }

  static get UNIQUES_TABLE() {
    return process.env.UNIQUES_TABLE;
  }
}
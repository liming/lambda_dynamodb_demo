/**
 * The file contain the method to encrypt a password with CMK.
 * @see https://docs.aws.amazon.com/kms/latest/developerguide/programming-encryption.html
 */

import * as AWS from 'aws-sdk';
import Constants from '@configs/constants';

/**
 *
 * @param {string} password the password need to be encrypted
 * @returns encrypted base64 password
 */
export const encryptPassword = (password: string): Promise<string> => {
  const kmsClient = new AWS.KMS();

  return new Promise((resolve, reject) => {
    const keyId = Constants.ENCRYPTED_KEY;
    const text = Buffer.from(password);

    // encrypt password with KMS
    kmsClient.encrypt({ KeyId: keyId, Plaintext: text }, (err, result) => {
      if (err) {
        return reject(err);
      }

      const { CiphertextBlob } = result;

      return resolve(CiphertextBlob.toString('base64'));
    });
  });
};

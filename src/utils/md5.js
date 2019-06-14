import { createHash } from 'crypto';

const salt = "67c142d5";

export const inputPassToFormPass = (inputPass) => {
  const hasher = createHash("md5");
  let str = salt.charAt(0) + salt.charAt(2) + inputPass + salt.charAt(5) + salt.charAt(4);
  hasher.update(str);
  let encryptString = hasher.digest("hex");
  return encryptString;
}
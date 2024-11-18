import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";

export const generateKeyPair = () => {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: naclUtil.encodeBase64(keyPair.publicKey),
    privateKey: naclUtil.encodeBase64(keyPair.secretKey),
  };
};

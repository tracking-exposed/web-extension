import nacl from "tweetnacl";
import bs58 from "bs58";
import { Buffer } from "buffer";

import CONFIG from "src/background/config";
import { decodeString, decodeKey } from "src/common/utils";

async function post(apiUrl, data, profile) {
  const body = JSON.stringify(data);
  const url = CONFIG.apiEndpoint + apiUrl;
  const signature = nacl.sign.detached(
    decodeString(body),
    new Uint8Array(profile.secretKey)
  );

  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      "X-Fbtrex-Version": CONFIG.version,
      "X-Fbtrex-Build": CONFIG.build,
      "X-Fbtrex-UserId": profile.id,
      "X-Fbtrex-PublicKey": profile.address,
      "X-Fbtrex-Signature": bs58.encode(Buffer.from(signature))
    },
    body
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

const api = {
  sync: post.bind(null, "events"),
  validate: post.bind(null, "validate"),
  userInfo: post.bind(null, "userInfo")
};

export default api;

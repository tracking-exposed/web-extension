import bs58 from "bs58";

import db from "src/background/db";

export async function getProfile(id) {
  const profile = await db.get(id);
  db.remove(id);
  return (
    profile && {
      address: profile.publicKey,
      publicKey: Array.from(bs58.decode(profile.publicKey)),
      secretKey: Array.from(bs58.decode(profile.secretKey)),
      optIn: !!profile.optin
    }
  );
}

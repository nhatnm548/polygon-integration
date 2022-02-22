const BN = require("bn.js");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Signature {
  toLowS(signature: { r: string; s: string }) {
    const r = new BN(signature.r, 16);
    let s = new BN(signature.s, 16);
    if (s.cmp(ec.nh) > 0) {
      s = ec.n.sub(s);
    }

    // BN.js seems to generate strings of less than 32 byte length
    // Hence the padding the strings with zeroes at the start to make upto 32 bytes
    return {
      r: r.toString("hex").padStart(64, "0"),
      s: s.toString("hex").padStart(64, "0")
    };
  }

  toBuf(signature: { r: string; s: string }) {
    const rBuf = Buffer.from(signature.r, "hex");
    const sBuf = Buffer.from(signature.s, "hex");
    return Buffer.concat([rBuf, sBuf]);
  }

  /**
   * Get recovery parameter given an ecpoint,
   * message and corresponding signature
   */
  getRecoveryParam(
    ecPoint: string,
    messageHash: string,
    signature: { r: string; s: string }
  ) {
    signature = this.toLowS(signature);

    const recoveryParameter = ec.getKeyRecoveryParam(
      new BN(messageHash, 16),
      signature,
      ec.keyFromPublic(ecPoint, "hex").pub
    );

    return {
      ...signature,
      recoveryParameter
    };
  }
}

export default new Signature();

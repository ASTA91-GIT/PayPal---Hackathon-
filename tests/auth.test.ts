import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, signSession, verifySessionToken } from "../src/lib/auth";

describe("TrustCart AI Cryptographic Authentication", () => {
  it("hashes password with random salt and verifies matching password", async () => {
    const rawPass = "TrustCart@2026";
    const hashed = await hashPassword(rawPass);

    expect(hashed).toContain(":");
    const [salt, key] = hashed.split(":");
    expect(salt.length).toBe(32); // 16 bytes in hex
    expect(key.length).toBe(128); // 64 bytes in hex

    const isMatch = await verifyPassword(rawPass, hashed);
    expect(isMatch).toBe(true);
  });

  it("rejects invalid password attempts", async () => {
    const hashed = await hashPassword("SecretPass#123");
    const isMatch = await verifyPassword("WrongPassword#999", hashed);
    expect(isMatch).toBe(false);
  });

  it("signs and verifies HMAC session tokens", () => {
    const payload = {
      userId: "user-123-uuid",
      email: "olivia.vance@techcorp.io",
      name: "Olivia Vance",
    };

    const token = signSession(payload);
    expect(token).toContain(".");

    const verified = verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(payload.userId);
    expect(verified?.email).toBe(payload.email);
    expect(verified?.name).toBe(payload.name);
    expect(verified?.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it("rejects tampered or forged tokens", () => {
    const token = signSession({ userId: "u1", email: "test@domain.com" });
    const tampered = token.slice(0, -4) + "XXXX";

    const verified = verifySessionToken(tampered);
    expect(verified).toBeNull();
  });
});

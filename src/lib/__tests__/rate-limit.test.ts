import { describe, it, expect, beforeEach, vi } from "vitest";

describe("checkRateLimit", () => {
  beforeEach(() => {
    // Reset the module to clear the in-memory store
    vi.resetModules();
  });

  it("allows the first request for a user", async () => {
    const { checkRateLimit: fresh } = await import("../rate-limit");
    const result = fresh("user-1");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(19);
  });

  it("decrements remaining count on each call", async () => {
    const { checkRateLimit: fresh } = await import("../rate-limit");
    fresh("user-2");
    const second = fresh("user-2");
    expect(second.allowed).toBe(true);
    expect(second.remaining).toBe(18);
  });

  it("blocks requests after hitting the limit", async () => {
    const { checkRateLimit: fresh } = await import("../rate-limit");
    const config = { maxRequests: 3, windowMs: 60 * 60 * 1000 };

    fresh("user-3", config);
    fresh("user-3", config);
    fresh("user-3", config);

    const result = fresh("user-3", config);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("returns resetAt timestamp in the future", async () => {
    const { checkRateLimit: fresh } = await import("../rate-limit");
    const result = fresh("user-4");
    expect(result.resetAt).toBeGreaterThan(Date.now());
  });

  it("tracks users independently", async () => {
    const { checkRateLimit: fresh } = await import("../rate-limit");
    const config = { maxRequests: 1, windowMs: 60 * 60 * 1000 };

    fresh("user-5", config);
    const blocked = fresh("user-5", config);
    const allowed = fresh("user-6", config);

    expect(blocked.allowed).toBe(false);
    expect(allowed.allowed).toBe(true);
  });

  it("resets after window expires", async () => {
    const { checkRateLimit: fresh } = await import("../rate-limit");
    const config = { maxRequests: 1, windowMs: 100 };

    fresh("user-7", config);
    const blocked = fresh("user-7", config);
    expect(blocked.allowed).toBe(false);

    // Wait for window to expire
    await new Promise((r) => setTimeout(r, 150));

    const afterReset = fresh("user-7", config);
    expect(afterReset.allowed).toBe(true);
    expect(afterReset.remaining).toBe(0);
  });

  it("uses default config of 20 requests per hour", async () => {
    const { checkRateLimit: fresh } = await import("../rate-limit");
    const result = fresh("user-8");
    expect(result.remaining).toBe(19); // 20 max - 1 used = 19
    expect(result.resetAt).toBeLessThanOrEqual(Date.now() + 60 * 60 * 1000 + 10);
  });
});

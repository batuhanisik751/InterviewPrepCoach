import { describe, it, expect } from "vitest";
import { redactPII } from "../pii-redaction";

describe("redactPII", () => {
  it("redacts phone numbers in (XXX) XXX-XXXX format", () => {
    const result = redactPII("Call me at (555) 123-4567 for details.");
    expect(result.redactedText).toContain("[PHONE]");
    expect(result.redactedText).not.toContain("555");
    expect(result.piiDetected).toBe(true);
    expect(result.redactionCounts["PHONE"]).toBe(1);
  });

  it("redacts phone numbers in XXX-XXX-XXXX format", () => {
    const result = redactPII("Phone: 555-123-4567");
    expect(result.redactedText).toContain("[PHONE]");
  });

  it("redacts phone numbers with +1 prefix", () => {
    const result = redactPII("Phone: +1-555-123-4567");
    expect(result.redactedText).toContain("[PHONE]");
  });

  it("redacts email addresses", () => {
    const result = redactPII("Contact: john.doe@example.com");
    expect(result.redactedText).toContain("[EMAIL]");
    expect(result.redactedText).not.toContain("john.doe@example.com");
    expect(result.redactionCounts["EMAIL"]).toBe(1);
  });

  it("redacts SSN-formatted numbers (XXX-XX-XXXX)", () => {
    const result = redactPII("SSN: 123-45-6789");
    expect(result.redactedText).toContain("[SSN]");
    expect(result.redactedText).not.toContain("123-45-6789");
    expect(result.redactionCounts["SSN"]).toBe(1);
  });

  it("redacts street addresses", () => {
    const result = redactPII("I live at 123 Main Street, Apt 4B");
    expect(result.redactedText).toContain("[ADDRESS]");
    expect(result.redactedText).not.toContain("123 Main Street");
  });

  it("redacts various street types", () => {
    const addresses = [
      "456 Oak Avenue",
      "789 Pine Drive",
      "101 Maple Road",
      "202 Elm Boulevard",
      "303 Cedar Lane",
    ];
    for (const addr of addresses) {
      const result = redactPII(addr);
      expect(result.redactedText).toContain("[ADDRESS]");
    }
  });

  it("redacts DOB when preceded by context keyword", () => {
    const result = redactPII("Date of birth: 01/15/1990");
    expect(result.redactedText).toContain("[DOB]");
    expect(result.redactedText).not.toContain("01/15/1990");
  });

  it("redacts DOB with 'born on' prefix", () => {
    const result = redactPII("Born on 03/25/1985");
    expect(result.redactedText).toContain("[DOB]");
  });

  it("redacts DOB with 'DOB:' prefix", () => {
    const result = redactPII("DOB: 12-25-1992");
    expect(result.redactedText).toContain("[DOB]");
  });

  it("does NOT redact non-DOB dates (graduation, employment)", () => {
    const result = redactPII(
      "Graduated May 2020. Employed from 01/2018 to 12/2022."
    );
    expect(result.redactedText).not.toContain("[DOB]");
    expect(result.redactedText).toContain("May 2020");
  });

  it("handles text with no PII", () => {
    const input =
      "Experienced software engineer with expertise in React and TypeScript.";
    const result = redactPII(input);
    expect(result.piiDetected).toBe(false);
    expect(result.redactedText).toBe(input);
  });

  it("redacts multiple PII instances in one text", () => {
    const input =
      "John Doe, john@example.com, (555) 987-6543, 123 Oak Drive";
    const result = redactPII(input);
    expect(result.redactedText).toContain("[EMAIL]");
    expect(result.redactedText).toContain("[PHONE]");
    expect(result.redactedText).toContain("[ADDRESS]");
    expect(result.piiDetected).toBe(true);
  });

  it("returns empty redactionCounts for clean text", () => {
    const result = redactPII("No personal info here.");
    expect(Object.keys(result.redactionCounts)).toHaveLength(0);
  });

  it("handles empty string", () => {
    const result = redactPII("");
    expect(result.piiDetected).toBe(false);
    expect(result.redactedText).toBe("");
  });

  it("preserves non-PII content around redacted items", () => {
    const result = redactPII(
      "Name: John Doe, Email: test@test.com, Role: Engineer"
    );
    expect(result.redactedText).toContain("Name: John Doe");
    expect(result.redactedText).toContain("[EMAIL]");
    expect(result.redactedText).toContain("Role: Engineer");
  });
});

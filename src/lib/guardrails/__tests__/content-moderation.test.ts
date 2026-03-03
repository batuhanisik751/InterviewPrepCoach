import { describe, it, expect } from "vitest";
import { moderateContent } from "../content-moderation";

describe("moderateContent", () => {
  it("passes clean professional text", () => {
    const result = moderateContent(
      "Led a cross-functional team to deliver a microservices migration on schedule."
    );
    expect(result.flagged).toBe(false);
    expect(result.severity).toBe("none");
  });

  it("does NOT flag 'offensive coordinator' (allowlisted)", () => {
    const result = moderateContent(
      "Served as offensive coordinator for the university football program."
    );
    expect(result.flagged).toBe(false);
  });

  it("does NOT flag 'penetration testing' (allowlisted)", () => {
    const result = moderateContent(
      "Performed penetration testing on enterprise web applications."
    );
    expect(result.flagged).toBe(false);
  });

  it("does NOT flag 'threat modeling' (allowlisted)", () => {
    const result = moderateContent(
      "Led threat modeling sessions for critical infrastructure."
    );
    expect(result.flagged).toBe(false);
  });

  it("does NOT flag 'kill chain' (allowlisted)", () => {
    const result = moderateContent(
      "Familiar with the Cyber Kill Chain methodology for incident response."
    );
    expect(result.flagged).toBe(false);
  });

  it("does NOT flag 'attack surface' (allowlisted)", () => {
    const result = moderateContent(
      "Reduced the attack surface by implementing network segmentation."
    );
    expect(result.flagged).toBe(false);
  });

  it("does NOT flag 'dead letter queue' (allowlisted)", () => {
    const result = moderateContent(
      "Implemented dead letter queue patterns for failed message handling."
    );
    expect(result.flagged).toBe(false);
  });

  it("does NOT flag 'master branch' (allowlisted)", () => {
    const result = moderateContent(
      "Merged feature branches into the master branch regularly."
    );
    expect(result.flagged).toBe(false);
  });

  it("detects hate speech and returns block severity", () => {
    const result = moderateContent("white power movement supporter");
    expect(result.flagged).toBe(true);
    expect(result.categories).toContain("hate-speech");
    expect(result.severity).toBe("block");
  });

  it("detects threats and returns block severity", () => {
    const result = moderateContent(
      "I will kill anyone who rejects my application"
    );
    expect(result.flagged).toBe(true);
    expect(result.categories).toContain("threats");
    expect(result.severity).toBe("block");
  });

  it("detects sexual content and returns block severity", () => {
    const result = moderateContent("This is pornography not a resume");
    expect(result.flagged).toBe(true);
    expect(result.categories).toContain("sexual-content");
    expect(result.severity).toBe("block");
  });

  it("detects profanity with warn severity", () => {
    const result = moderateContent("This fucking interview was terrible");
    expect(result.flagged).toBe(true);
    expect(result.categories).toContain("profanity");
    expect(result.severity).toBe("warn");
  });

  it("block severity takes precedence over warn", () => {
    const result = moderateContent("I will kill you, you fucking idiot");
    expect(result.flagged).toBe(true);
    expect(result.severity).toBe("block");
    expect(result.categories).toContain("threats");
    expect(result.categories).toContain("profanity");
  });

  it("handles empty string", () => {
    const result = moderateContent("");
    expect(result.flagged).toBe(false);
    expect(result.severity).toBe("none");
  });

  it("handles normal text with technical jargon", () => {
    const result = moderateContent(
      "Deployed Kubernetes clusters on AWS with Terraform. Managed CI/CD pipelines using Jenkins."
    );
    expect(result.flagged).toBe(false);
  });
});

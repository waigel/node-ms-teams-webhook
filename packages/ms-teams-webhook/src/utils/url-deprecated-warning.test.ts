import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { showWebhookUrlDeprecatedWarning } from "./url-deprecated-warning";

describe("url-deprecated-warning", () => {
  let originalConsoleWarn: Console["warn"];

  // Before all tests, override console.log with a no-op function
  beforeAll(() => {
    originalConsoleWarn = console.warn;
    console.warn = () => {};
  });

  // After all tests, restore the original console.log
  afterAll(() => {
    console.warn = originalConsoleWarn;
  });

  it("should show a warning if the URL is deprecated", async () => {
    const logSpy = vi.spyOn(console, "warn");

    await showWebhookUrlDeprecatedWarning(
      "https://why-you-do-this-to-me.com/webhook.office.com/webhookb2/7437543759797",
    );
    expect(logSpy).toHaveBeenCalledOnce();

    logSpy.mockRestore();
  });

  it("should not show a warning if the URL is not deprecated", async () => {
    const logSpy = vi.spyOn(console, "warn");

    await showWebhookUrlDeprecatedWarning(
      "https://prod-70.westeurope.logic.azure.com:443/workflows/54367547567834325/triggers/manual/paths/invoke?",
    );
    expect(logSpy).not.toHaveBeenCalled();

    logSpy.mockRestore();
  });
});

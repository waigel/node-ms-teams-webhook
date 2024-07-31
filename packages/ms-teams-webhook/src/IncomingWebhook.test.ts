import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { IncomingWebhook } from "./IncomingWebhook";
import { MicrosoftTeamsError } from "./errors";
import { TinyAssertionError } from "./utils/tinyassert";

const server = setupServer(
  http.post("http://localhost/wrong-schema", () => {
    return HttpResponse.json(
      {
        error: {
          code: "TriggerInputSchemaMismatch",
          message: "The input body for trigger ...",
        },
      },
      { status: 400 },
    );
  }),
  http.post("http://localhost/text", () => {
    return HttpResponse.text("Received");
  }),
);

describe("IncomingWebhook", () => {
  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  describe("sendText", () => {
    it("should send message", async () => {
      const webhook = new IncomingWebhook("http://localhost/text");
      await webhook.sendText("hey?! - öß");
    });

    it("should throw MicrosoftTeamsError if input schema mismatch", async () => {
      const webhook = new IncomingWebhook("http://localhost/wrong-schema");
      await expect(webhook.sendText("invalid-schema")).rejects.toThrowError(
        new MicrosoftTeamsError(
          "The input body for trigger ...",
          "TriggerInputSchemaMismatch",
        ),
      );
    });

    it("should throw tinyassert if text input undefined", async () => {
      const webhook = new IncomingWebhook("http://localhost/wrong-schema");
      await expect(webhook.sendText(undefined!)).rejects.toThrowError(
        new TinyAssertionError("text cannot be empty or undefined"),
      );
    });

    it("should throw tinyassert if text input empty", async () => {
      const webhook = new IncomingWebhook("http://localhost/wrong-schema");
      await expect(webhook.sendText("")).rejects.toThrowError(
        new TinyAssertionError("text cannot be empty or undefined"),
      );
    });
  });
});

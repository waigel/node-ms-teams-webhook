import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { AdaptiveCardMock } from "../tests/adaptive-card-mock";
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
  http.post("http://localhost/echo", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(body);
  }),
  http.post("http://localhost/echo-text", async ({ request }) => {
    const body = await request.text();
    return HttpResponse.text(body);
  }),
);

describe("IncomingWebhook", () => {
  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  describe("sendText", () => {
    it("should send message", async () => {
      const webhook = new IncomingWebhook("http://localhost/echo-text");
      const res = await webhook.sendText("hey?! - öß");
      expect(res.data).toBe("hey?! - öß");
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

  describe("sendAdaptiveCard", () => {
    it("should send single adaptive card", async () => {
      const webhook = new IncomingWebhook("http://localhost/echo");

      const result = await webhook.sendAdaptiveCard(
        AdaptiveCardMock.templatePayload,
        AdaptiveCardMock.templateDataPayload,
      );
      expect(result.data).toEqual(AdaptiveCardMock.mergedPayload);
    });

    it("should send multiple adaptive cards", async () => {
      const webhook = new IncomingWebhook("http://localhost/echo");

      const result = await webhook.sendAdaptiveCard(
        AdaptiveCardMock.templatePayload,
        [
          AdaptiveCardMock.templateDataPayload,
          { ...AdaptiveCardMock.templateDataPayload, title: "Title 2" },
        ],
      );
      expect(result.data).toEqual(AdaptiveCardMock.mergedPayloadsOfTwoCards);
    });

    it("should throw tinyassert if adaptiveCard schema is undefined", async () => {
      const webhook = new IncomingWebhook("http://localhost/echo");

      await expect(
        webhook.sendAdaptiveCard(undefined!, {}),
      ).rejects.toThrowError(
        new TinyAssertionError(
          "adaptiveCard schema cannot be empty or undefined",
        ),
      );
    });

    it("should throw tinyassert if adaptiveCard schema is not AdaptiveCard type", async () => {
      const webhook = new IncomingWebhook("http://localhost/echo");

      await expect(
        webhook.sendAdaptiveCard(
          { type: "InvalidType" } as any,
          AdaptiveCardMock.templateDataPayload,
        ),
      ).rejects.toThrowError(
        new TinyAssertionError("Only 'AdaptiveCard' type is supported"),
      );
    });

    it("should send card with empty data", async () => {
      const webhook = new IncomingWebhook("http://localhost/echo");

      const result = await webhook.sendAdaptiveCard(
        AdaptiveCardMock.templatePayload,
      );
      expect(result.data).toEqual({
        type: "message",
        summary: "Adaptive Card",
        attachments: [
          {
            contentType: "application/vnd.microsoft.card.adaptive",
            content: AdaptiveCardMock.templatePayload,
          },
        ],
      });
    });
  });

  describe("send", () => {
    // Deprecated send method
    it("should send message card", async () => {
      const messageCard = {
        "@type": "MessageCard",
        "@context": "https://schema.org/extensions",
        summary: "Issue 176715375",
        themeColor: "0078D7",
        title: 'Issue opened: "Push notifications not working"',
        sections: [
          {
            activityTitle: "Miguel Garcie",
            activitySubtitle: "9/13/2016, 11:46am",
            activityImage:
              "https://connectorsdemo.azurewebsites.net/images/MSC12_Oscar_002.jpg",
            text: "There is a problem with Push notifications, they don't seem to be picked up by the connector.",
          },
        ],
      };

      const webhook = new IncomingWebhook("http://localhost/echo-text");
      const res = await webhook.send(messageCard);
      expect(res).toEqual(messageCard);
    });
  });

  describe("sendRawAdaptiveCard", () => {
    // Deprecated send method
    it("should send any json payload", async () => {
      const anyJsonPayload = {
        "@type": "CustomTypeForMessageCard",
        _context: "https://schema.org/extensions",
        summary: "Issue 176715375",
        themeColor: "0078D7",
        title: 'Issue opened: "Push notifications not working"',
        fields: [
          {
            name: "Miguel Garcie",
          },
        ],
      };

      const webhook = new IncomingWebhook("http://localhost/echo");
      const res = await webhook.sendRawAdaptiveCard(anyJsonPayload);
      expect(res.data).toEqual(anyJsonPayload);
    });
  });
});

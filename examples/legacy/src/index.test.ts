import { IncomingWebhook } from "ms-teams-webhook-legacy";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import express from "express";
import bodyParser from "body-parser";

let server;
let receivedData = null;
describe("legacy-message-card", () => {
  beforeAll(() => {
    const app = express();
    app.use(bodyParser.json());

    app.post("/api/call", (req, res) => {
      receivedData = req.body;
      res.status(200).send("Received");
    });

    server = app.listen(3001);
  });

  afterAll(() => {
    server.close();
  });

  it("should receive and handle a webhook", async () => {
    const mockUrl = "http://localhost:3001/api/call";

    const webhook = new IncomingWebhook(mockUrl);
    await webhook.send(MESSAGE_CARD);

    expect(receivedData).toEqual(MESSAGE_CARD);
  });
});

const MESSAGE_CARD = {
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

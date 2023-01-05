> :warning: Version under 2.0.x is not compatible with the new Microsoft Teams Incoming Webhooks. Please upgrade to 2.0.x
>
> `npm install ms-teams-webhook@2.0.0`

# Microsoft Incoming Webhooks

This package helps you making requests to Microsoft Teams Incoming Webhooks. Use it in your application to send a notification to a channel.

## Installation

```shell
$ npm install ms-teams-webhook
```

## Usage

### Initialize the webhook

The package exports a `IncomingWebhook` class. You'll need to initialize it with the URL you received from Microsoft Teams.

The URL can come from installation the `Webhook Connector` by `right click on a channel > Incomming Webhook > Configuration > (insert a name) > Create`

### Javascript example:

```javascript
const { IncomingWebhook } = require("ms-teams-webhook");

// Read a url from the environment variables
const url = process.env.MS_TEAMS_WEBHOOK_URL;

// Initialize
const webhook = new IncomingWebhook(url);
```

### Typescript example:

```typescript
import { IncomingWebhook } from "ms-teams-webhook";

// Read a url from the environment variables
const url = process.env.MS_TEAMS_WEBHOOK_URL;
if (!url) {
  throw new Error("MS_TEAMS_WEBHOOK_URL is required");
}

// Initialize
const webhook = new IncomingWebhook(url);
```

### Send a webhook

This is a very nice page to generate the payload for your Microsoft Teams Webhook.

https://messagecardplayground.azurewebsites.net/

or you can use the "Editor for adaptive cards" in the Microsoft Teams Developer Portal

https://dev.teams.microsoft.com/cards

After you set up the webhook (see above), you can send a message to the channel by calling `webhook.send()`.

```typescript
(async () => {
  await webhook.send({
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
  });
})();
```

---

Credits go out to Slack. I took her [Webhook lib](https://github.com/slackapi/node-slack-sdk/blob/master/packages/webhook/README.md) as a template for this API.

# Microsoft Incoming Webhooks
This package helps you making requests to Microsoft Teams Incoming Webhooks. Use it in your application to send a notification to a channel.

## Installation

```shell
$ npm install ms-teams-webhook
```

## Usage

### Initialize the webhook

The package exports a `IncomingWebhook` class. You'll need to initialize it with the URL you received from Microsoft Teams.

The URL can come from installation the `Webhook Connector` by `right click on a channel > Incoming Webhook > Configuration > (insert a name) > Create`


```javascript
const { IncomingWebhook } = require('ms-teams-webhook');

// Read a url from the environment variables
const url = process.env.MS_TEAMS_WEBHOOK_URL;

// Initialize
const webhook = new IncomingWebhook(url);
```

### Send a webhook

This is a very nice page to generate the payload for your Microsoft Teams Webhook.

https://messagecardplayground.azurewebsites.net/

You can only send JSON-stringified objects. I.e. `payload` needs to be stringified with `JSON.stringify(payload)` and passed to the client.

```javascript
const { IncomingWebhook } = require('ms-teams-webhook');

// Read a url from the environment variables
const url = process.env.MS_TEAMS_WEBHOOK_URL;

// Initialize
const webhook = new IncomingWebhook(url);

(async () => {
  await webhook.send(JSON.stringify({
    "@type": "MessageCard",
    "@context": "https://schema.org/extensions",
    "summary": "Issue 176715375",
    "themeColor": "0078D7",
    "title": "Issue opened: \"Push notifications not working\"",
    "sections": [
      {
        "activityTitle": "Miguel Garcie",
        "activitySubtitle": "9/13/2016, 11:46am",
        "activityImage": "https://connectorsdemo.azurewebsites.net/images/MSC12_Oscar_002.jpg",
        "text": "There is a problem with Push notifications, they don't seem to be picked up by the connector."
      }
    ]
  }));
})();

```

---

Credits go out to Slack. I took her [Webhook lib](https://github.com/slackapi/node-slack-sdk/blob/master/packages/webhook/README.md) as a template for this API.

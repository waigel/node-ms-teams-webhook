const { IncomingWebhook } = require("../out/index");

async function sendTeamsNotification(payload) {
  const url = process.env.MS_TEAMS_WEBHOOK_URL;
  const webhook = new IncomingWebhook(url);
  await webhook.send(payload);
}

sendTeamsNotification({
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

// Inside this repo direct from the OUT folder.
import { IncomingWebhook } from "../src/index";
// Outside of this repo.
// import { IncomingWebhook } from "ms-teams-webhook";

// Read a url from the environment variables
const url = process.env.MS_TEAMS_WEBHOOK_URL;
if (!url) {
  throw new Error("MS_TEAMS_WEBHOOK_URL is required");
}

// Initialize
const webhook = new IncomingWebhook(url);

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
  console.log("Webhook message successfully sent to Microsoft Teams!");
  console.log("Check your channel to see the message.");
})();

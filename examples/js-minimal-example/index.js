const { IncomingWebhook } = require("ms-teams-webhook");

(async () => {
  const url = process.env["MS_TEAMS_WEBHOOK_URL"];
  if (!url) {
    throw new Error("MS_TEAMS_WEBHOOK_URL is required");
  }
  const webhook = new IncomingWebhook(url);

  try {
    await webhook.sendAdaptiveCard(
      {
        type: "AdaptiveCard",
        body: [
          {
            type: "TextBlock",
            size: "medium",
            weight: "bolder",
            text: "${title}",
          },
          {
            type: "TextBlock",
            text: "${description}",
            wrap: true,
          },
        ],
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        version: "1.4",
      },
      {
        title: "Example card",
        description: "This is an example card",
      },
    );
    console.log("Yuup, the adaptive card was sent!");
  } catch (err) {
    console.error(err);
  }
})();

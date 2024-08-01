/**
 * Microsoft deprecated the old Webhook Connector, all URLs with the old format don't work anymore.
 * We are warning the user if they are using the old URL format.
 * Maybe he/she is not aware of the change or a wrong environment variable is set.
 * @param url
 */

const deprecatedURLs = ["webhook.office.com/webhookb2"];

export async function showWebhookUrlDeprecatedWarning(url: string) {
  for (const deprecatedURL of deprecatedURLs) {
    if (url.includes(deprecatedURL)) {
      await import("chalk").then((_chalk) => {
        const chalk = _chalk.default;
        console.warn(
          `\n\n
                                            ${chalk.yellowBright(
                                              "############# WARNING #############",
                                            )}\n
        ${chalk.yellowBright(
          "You are using a deprecated Webhook URL:",
        )} ${chalk.yellow(url)}

        Retirement of Office 365 connectors within Microsoft Teams. Create a new Workspace App and use the new URL with this library.

        ${chalk.gray(
          "Upgrade documentation: https://github.com/waigel/node-ms-teams-webhook/blob/master/MIGRATION.md",
        )}
        ${chalk.gray(
          "Original message from Microsoft: https://devblogs.microsoft.com/microsoft365dev/retirement-of-office-365-connectors-within-microsoft-teams",
        )}
        `,
        );
      });
    }
  }
}

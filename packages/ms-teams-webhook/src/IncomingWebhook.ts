import * as ACData from "adaptivecards-templating";
import axios, {
  isAxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import type { AdaptiveCard } from "./adaptive-card";
import { MicrosoftTeamsError } from "./errors/MicrosoftTeamsError";
import { tinyassert } from "./utils/tinyassert";
import { showWebhookUrlDeprecatedWarning } from "./utils/url-deprecated-warning";

/**
 * @deprecated Use AxiosResponse directly
 */
export interface IncomingWebhookResult {
  text: string;
}
/**
 * A client for Teams's Incoming Webhooks
 */

interface Payload {
  [key: string]: any;
}
export class IncomingWebhook {
  /**
   * The webhook URL
   */
  private url: string;

  /**
   * Axios HTTP client instance used by this client
   */
  private axios: AxiosInstance;

  constructor(url: string) {
    if (url === undefined) {
      throw new Error("Incoming webhook URL is required");
    }

    this.url = url;

    this.axios = axios.create({
      baseURL: url,
      maxRedirects: 0,
      proxy: false,
    });
  }

  /**
   * Send a notification to a conversation
   * @param message the message (object describing the message)
   * @deprecated Microsoft deprecated O365 Connectors, switch to Workflow Apps and use the new
   * `sendText` or `sendAdaptiveCard` methods
   */
  public async send(
    message: Payload,
  ): Promise<IncomingWebhookResult | undefined> {
    // NOTE: no support for TLS config
    let payload = message;

    if (typeof payload === "string") {
      throw new Error(
        "Message must be a JSON object. Dont use a string or JSON.stringify() your message",
      );
    }

    try {
      const response = await this.axios.post(this.url, payload);

      return this.buildResult(response).data;
    } catch (error) {
      return handleError(error);
    }
  }

  /**
   * Sends a plain text message to a team channel or conversation.
   *
   * @param text The text message to be sent.
   * @returns A promise that resolves when the message is sent successfully.
   */
  public async sendText(text: string) {
    tinyassert(text, "text cannot be empty or undefined");
    tinyassert(typeof text === "string", "text must be a string");

    // Show console warning, if URL is deprecated
    showWebhookUrlDeprecatedWarning(this.url);

    return await this.sendPlainTextRequest(text);
  }

  /**
   * Sends an adaptive card to a team channel or conversation.
   * Use the Adaptive Card Designer (https://adaptivecards.io/designer) to create your card schema.
   *
   * This function takes a template payload and fills it with the provided data. Placeholders in the
   * template should be defined using ${variableName}, which will be replaced with values from the
   * data object. The variable names must match the keys in the data object.
   *
   * If you want to send multiple adaptive cards with different data, provide an array of data objects.
   *
   * @param templatePayload The adaptive card schema to be used as the template.
   * @param data The data object or array of data objects used to fill the adaptive card. If not provided,
   * the card will be sent as is.
   * @returns A promise that resolves when the card is sent successfully.
   */
  public async sendAdaptiveCard<T extends AdaptiveCard, D = any>(
    templatePayload: T,
    data?: D | [],
  ) {
    tinyassert(
      templatePayload,
      "adaptiveCard schema cannot be empty or undefined",
    );

    tinyassert(
      templatePayload.type === "AdaptiveCard",
      "Only 'AdaptiveCard' type is supported",
    );

    // Show console warning, if URL is deprecated
    showWebhookUrlDeprecatedWarning(this.url);

    const templatePayloadData = Array.isArray(data) ? data : [data];

    const cards = [];

    for (const data of templatePayloadData) {
      const template = new ACData.Template(templatePayload);
      const context: ACData.IEvaluationContext = {
        $root: {
          ...data,
        },
      };
      cards.push(template.expand(context));
    }

    if (cards.length === 0) {
      cards.push(new ACData.Template(templatePayload));
    }

    return await this.sendPlainJSONRequest({
      type: "message",
      summary: "Adaptive Card",
      attachments: cards.map((card) => ({
        contentType: "application/vnd.microsoft.card.adaptive",
        content: card,
      })),
    });
  }

  /**
   * Sends a raw JSON payload to the incoming webhook. This method is generic and can be used for sending
   * any type of message payload, including adaptive cards. However, it is recommended to use the
   * `sendText` and `sendAdaptiveCard` methods for sending text and adaptive cards, respectively.
   *
   * Note: When sending an adaptive card, ensure that your card JSON is wrapped in the following structure:
   * {
   *   "type": "message",
   *   "attachments": [
   *     {
   *       "contentType": "application/vnd.microsoft.card.adaptive",
   *       "contentUrl": null,
   *       "content": { >>> YOUR CARD HERE <<< }
   *     }
   *   ]
   * }
   *
   * @param card The raw JSON payload representing the message or card to be sent.
   * @returns A promise that resolves when the raw card is sent successfully.
   */
  public sendRawAdaptiveCard<T>(card: T) {
    return this.sendPlainJSONRequest(card);
  }

  private async sendPlainTextRequest(text: string) {
    try {
      const response = await this.axios.post(this.url, text, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
      return this.buildResult(response);
    } catch (error) {
      handleError(error);
    }
  }

  private async sendPlainJSONRequest<T>(jsonPayload: T) {
    try {
      const response = await this.axios.post(this.url, jsonPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return this.buildResult(response);
    } catch (error) {
      handleError(error);
    }
  }

  /**
   * Processes an HTTP response into an IncomingWebhookResult.
   */
  private buildResult(response: AxiosResponse) {
    return response;
  }
}

function handleError(error: unknown): never {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    const status = error.response?.status;
    if (data && status === 400) {
      /**
       * Throw a MicrosoftTeamsError if the error is a 400 Bad Request
       * and the response contains an error code and message.
       */
      if ("error" in data && "code" in data.error) {
        const microsoftErrorCode = data.error.code;
        const microsoftErrorMessage = data.error.message;
        throw new MicrosoftTeamsError(
          microsoftErrorMessage,
          microsoftErrorCode,
        );
      }
    }
  }
  throw error;
}

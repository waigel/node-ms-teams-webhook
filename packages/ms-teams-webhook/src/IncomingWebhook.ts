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
    // Show console warning, if URL is deprecated
    showWebhookUrlDeprecatedWarning(url);

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
   * @deprecated Use sendText or sendAdaptiveCard instead (NOT COMAP)
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

  public async sendText(text: string) {
    tinyassert(text, "text cannot be empty or undefined");
    tinyassert(typeof text === "string", "text must be a string");

    return await this.sendPlainTextRequest(text);
  }

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

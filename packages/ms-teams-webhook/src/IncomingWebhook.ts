import axios, {
  isAxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import { MicrosoftTeamsError } from "./errors/MicrosoftTeamsError";
import { tinyassert } from "./utils/tinyassert";
import { showWebhookUrlDeprecatedWarning } from "./utils/url-deprecated-warning";

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

      return this.buildResult(response);
    } catch (error) {
      return handleError(error);
    }
  }

  public async sendText(text: string) {
    tinyassert(text, "text cannot be empty or undefined");
    tinyassert(typeof text === "string", "text must be a string");

    return await this.sendPlainTextRequest(text);
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

  /**
   * Processes an HTTP response into an IncomingWebhookResult.
   */
  private buildResult(response: AxiosResponse): IncomingWebhookResult {
    return {
      text: response.data,
    };
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

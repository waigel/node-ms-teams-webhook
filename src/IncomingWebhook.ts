import axios, { AxiosInstance, AxiosResponse } from 'axios';
import  {IncomingWebhookResult} from './types'


/**
 * A client for Slack's Incoming Webhooks
 */
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
      throw new Error('Incoming webhook URL is required');
    }

    this.url = url;

    this.axios = axios.create({
      baseURL: url,
      maxRedirects: 0,
      proxy: false
    });
  }

  /**
   * Send a notification to a conversation
   * @param message the message (a simple string, or an object describing the message)
   */
  public async send(message: string): Promise<IncomingWebhookResult | undefined> {
    // NOTE: no support for TLS config
    let  payload = message;

    try {
      const response = await this.axios.post(this.url, payload);

      return this.buildResult(response);
    } catch (error) {
      // make troubleshooting API failures a bit easier by pinning the response body on the error
      error.text = this.buildResult(error.response).text;
      throw error;
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

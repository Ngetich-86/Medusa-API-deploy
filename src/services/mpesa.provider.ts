import { BaseService } from "medusa-interfaces";
import axios from "axios";

class MpesaService extends BaseService {
  private consumerKey: string;
  private consumerSecret: string;
  private businessShortCode: string;
  private passKey: string;
  private callbackUrl: string;
  private environment: string;

  constructor({}, options) {
    super();
    this.consumerKey = process.env.MPESA_CONSUMER_KEY!;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
    this.businessShortCode = process.env.MPESA_BUSINESS_SHORTCODE!;
    this.passKey = process.env.MPESA_PASSKEY!;
    this.callbackUrl = process.env.MPESA_CALLBACK_URL!;
    this.environment = process.env.MPESA_ENVIRONMENT!;
  }

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString("base64");
    const response = await axios.get(
      `https://${this.environment}.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return response.data.access_token;
  }

  async initiateSTKPush(phoneNumber: string, amount: number, reference: string): Promise<any> {
    const accessToken = await this.getAccessToken();
    const timestamp = new Date().toISOString().replace(/[-:.]/g, "").slice(0, -3);
    const password = Buffer.from(`${this.businessShortCode}${this.passKey}${timestamp}`).toString("base64");

    const response = await axios.post(
      `https://${this.environment}.safaricom.co.ke/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: this.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: this.businessShortCode,
        PhoneNumber: phoneNumber,
        CallBackURL: this.callbackUrl,
        AccountReference: reference,
        TransactionDesc: "Payment for order",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  }
}

export default MpesaService;
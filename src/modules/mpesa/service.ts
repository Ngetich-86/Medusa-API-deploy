// import { AbstractPaymentProvider } from "@medusajs/utils";
// import {
//   CreatePaymentProviderSession,
//   PaymentProviderError,
//   PaymentProviderSessionResponse,
//   // PaymentSessionStatusEnum,
// } from "@medusajs/framework/types";
// // import { PaymentSessionStatus } from "@medusajs/framework/types";
// import type { PaymentSessionStatus } from "@medusajs/framework/types";

// import axios from "axios";

// type Options = {
//   apiKey: string;
// };

// class MpesaPaymentProviderService extends AbstractPaymentProvider<Options> {
//   static identifier = "mpesa";

//   private consumerKey: string;
//   private consumerSecret: string;
//   private businessShortCode: string;
//   private passKey: string;
//   private callbackUrl: string;
//   private environment: string;

//   constructor(container, options) {
//     super(container, options);

//     this.consumerKey = process.env.MPESA_CONSUMER_KEY!;
//     this.consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
//     this.businessShortCode = process.env.MPESA_BUSINESS_SHORTCODE!;
//     this.passKey = process.env.MPESA_PASSKEY!;
//     this.callbackUrl = process.env.MPESA_CALLBACK_URL!;
//     this.environment = process.env.MPESA_ENVIRONMENT!;
//   }

//   private async getAccessToken(): Promise<string> {
//     const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString("base64");
//     const response = await axios.get(
//       `https://${this.environment}.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`,
//       {
//         headers: {
//           Authorization: `Basic ${auth}`,
//         },
//       }
//     );
//     return response.data.access_token;
//   }

//   async initiatePayment(
//     context: CreatePaymentProviderSession
//   ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
//     const { amount, currency_code, context: customerDetails } = context;
//     const accessToken = await this.getAccessToken();
//     const timestamp = new Date().toISOString().replace(/[-:.]/g, "").slice(0, -3);
//     const password = Buffer.from(`${this.businessShortCode}${this.passKey}${timestamp}`).toString("base64");

//     const response = await axios.post(
//       `https://${this.environment}.safaricom.co.ke/mpesa/stkpush/v1/processrequest`,
//       {
//         BusinessShortCode: this.businessShortCode,
//         Password: password,
//         Timestamp: timestamp,
//         TransactionType: "CustomerPayBillOnline",
//         Amount: amount,
//         PartyA: customerDetails.customer?.phone ?? "",
//         PartyB: this.businessShortCode,
//         PhoneNumber: customerDetails.customer?.phone ?? "",
//         CallBackURL: this.callbackUrl,
//         // AccountReference: customerDetails.metadata?.order_id ?? "DefaultOrderID",
//         AccountReference: "DefaultOrderID",
//         TransactionDesc: "Payment for order",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     return {
//       id: response.data.CheckoutRequestID,
//       data: response.data,
//     } as PaymentProviderSessionResponse;
//   }

//   async authorizePayment(
//     paymentSessionData: Record<string, unknown>,
//     context: Record<string, unknown>
//   ): Promise<PaymentProviderError | { status: PaymentSessionStatus; data: Record<string, unknown> }> {
//     return {
//       status: PaymentSessionStatus.AUTHORIZED,
//       data: paymentSessionData,
//     };
//   }

//   async capturePayment(
//     paymentSessionData: Record<string, unknown>
//   ): Promise<PaymentProviderError | Record<string, unknown>> {
//     return paymentSessionData;
//   }

//   async getPaymentStatus(
//     paymentSessionData: Record<string, unknown>
//   ): Promise<PaymentSessionStatus> {
//     return PaymentSessionStatus.AUTHORIZED;
//   }

//   async refundPayment(
//     paymentSessionData: Record<string, unknown>,
//     refundAmount: number
//   ): Promise<PaymentProviderError | Record<string, unknown>> {
//     return paymentSessionData;
//   }

//   async cancelPayment(
//     paymentSessionData: Record<string, unknown>
//   ): Promise<PaymentProviderError | Record<string, unknown>> {
//     return paymentSessionData;
//   }

//   async deletePayment(
//     paymentSessionData: Record<string, unknown>
//   ): Promise<PaymentProviderError | Record<string, unknown>> {
//     return paymentSessionData;
//   }

//   async retrievePayment(
//     paymentSessionData: Record<string, unknown>
//   ): Promise<PaymentProviderError | Record<string, unknown>> {
//     return paymentSessionData;
//   }

//   async updatePayment(
//     context: CreatePaymentProviderSession
//   ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
//     return {
//       id: "updated_payment_id",
//       status: PaymentSessionStatus.PENDING,
//       data: {},
//     } as PaymentProviderSessionResponse;
//   }

//   async getWebhookActionAndData(payload: any): Promise<any> {
//     return {
//       action: "not_supported",
//     };
//   }
// }

// export default MpesaPaymentProviderService;

import { AbstractPaymentProvider } from "@medusajs/utils";
import {
  CreatePaymentProviderSession,
  PaymentProviderError,
  PaymentProviderSessionResponse,
} from "@medusajs/framework/types";
import type { PaymentSessionStatus } from "@medusajs/framework/types";
import axios from "axios";

type Options = {
  apiKey: string;
};

const AUTHORIZED: PaymentSessionStatus = "authorized";
const PENDING: PaymentSessionStatus = "pending";

class MpesaPaymentProviderService extends AbstractPaymentProvider<Options> {
  static identifier = "mpesa";

  private consumerKey: string;
  private consumerSecret: string;
  private businessShortCode: string;
  private passKey: string;
  private callbackUrl: string;
  private environment: string;

  constructor(container, options) {
    super(container, options);

    this.consumerKey = process.env.MPESA_CONSUMER_KEY!;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
    this.businessShortCode = process.env.MPESA_BUSINESS_SHORTCODE!;
    this.passKey = process.env.MPESA_PASSKEY!;
    this.callbackUrl = process.env.MPESA_CALLBACK_URL!;
    this.environment = process.env.MPESA_ENV!;
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

  async initiatePayment(
    context: CreatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    const { amount, currency_code, context: customerDetails } = context;
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
        PartyA: customerDetails.customer?.phone ?? "",
        PartyB: this.businessShortCode,
        PhoneNumber: customerDetails.customer?.phone ?? "",
        CallBackURL: this.callbackUrl,
        AccountReference: "DefaultOrderID",
        TransactionDesc: "Payment for order",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return {
      id: response.data.CheckoutRequestID,
      data: response.data,
    } as PaymentProviderSessionResponse;
  }

  async authorizePayment(
    paymentSessionData: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<PaymentProviderError | { status: PaymentSessionStatus; data: Record<string, unknown> }> {
    return {
      status: AUTHORIZED,
      data: paymentSessionData,
    };
  }

  async capturePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    return paymentSessionData;
  }

  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    return AUTHORIZED;
  }

  async refundPayment(
    paymentSessionData: Record<string, unknown>,
    refundAmount: number
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    return paymentSessionData;
  }

  async cancelPayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    return paymentSessionData;
  }

  async deletePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    return paymentSessionData;
  }

  async retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentProviderError | Record<string, unknown>> {
    return paymentSessionData;
  }

  async updatePayment(
    context: CreatePaymentProviderSession
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    return {
      id: "updated_payment_id",
      status: PENDING,
      data: {},
    } as PaymentProviderSessionResponse;
  }

  async getWebhookActionAndData(payload: any): Promise<any> {
    return {
      action: "not_supported",
    };
  }
}

export default MpesaPaymentProviderService;

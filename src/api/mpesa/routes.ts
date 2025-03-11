import { Router, Request, Response } from "express";
import MpesaPaymentProviderService from "src/modules/mpesa/service";

export default (rootDirectory: string): Router | Router[] => {
  const router = Router();

  // Handle M-Pesa callback
  router.post("/mpesa-callback", async (req: Request, res: Response) => {
    const callbackData = req.body;
    console.log("M-Pesa Callback Data:", callbackData);

    try {
      const { CheckoutRequestID, ResultCode } = callbackData;

      // Resolve the M-Pesa payment provider service
      const paymentService: MpesaPaymentProviderService = req.scope.resolve("mpesaPaymentProviderService");

      // Update payment status correctly
      await paymentService.updatePayment(CheckoutRequestID, 
        // ResultCode === "0" ? "authorized" : "failed"
      );

      res.status(200).send("Callback received");
    } catch (error) {
      console.error("Error handling M-Pesa callback:", error);
      res.status(500).send("Error processing callback");
    }
  });

  // Endpoint to initiate STK Push payment
  router.post("/initiate-stk-push", async (req: Request, res: Response) => {
    const { amount, phone, order_id } = req.body;

    try {
      // Resolve the M-Pesa payment provider service
      const paymentService: MpesaPaymentProviderService = req.scope.resolve("mpesaPaymentProviderService");

      // Initiate STK Push payment with correct `context`
      const paymentResponse = await paymentService.initiatePayment({
        amount,
        currency_code: "KES",
        context: {
          customer: {
            phone,
          },
          // metadata: {
          //   order_id: order_id || "default_order_id", // Use metadata for tracking
          // },
        },
      });

      res.status(200).json(paymentResponse);
    } catch (error) {
      console.error("Error initiating STK Push payment:", error);
      res.status(500).json({ error: "Failed to initiate payment" });
    }
  });

  return router;
};

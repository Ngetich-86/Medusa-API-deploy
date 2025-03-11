import { Router } from "express";

const router = Router();

router.post("/callback", (req, res) => {
  const callbackData = req.body;
  console.log("M-Pesa Callback Data:", callbackData);

  // Process the callback data (e.g., update order status)
  res.status(200).send("Callback received");
});

export default router;
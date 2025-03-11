import { Router } from "express";
import mpesaRoutes from "./routes";

const router = Router();

router.use("/mpesa", mpesaRoutes);

export default router;

// // import MpesaRoutes from "./routes";

// // export default async (container, options) => {
// //   const app = container.resolve("app");
// //   app.use("/api/mpesa", MpesaRoutes(__dirname)); // 👈 Add this to register routes
// // };

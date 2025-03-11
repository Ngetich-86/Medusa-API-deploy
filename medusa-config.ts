// import { QUOTE_MODULE } from "./src/modules/quote";
// import { APPROVAL_MODULE } from "./src/modules/approval";
// import { COMPANY_MODULE } from "./src/modules/company";
// import { loadEnv, defineConfig, Modules } from "@medusajs/framework/utils";
// // import path from "path";

// loadEnv(process.env.NODE_ENV!, process.cwd());

// module.exports = defineConfig({
//   projectConfig: {
//     databaseUrl: process.env.DATABASE_URL,
//     http: {
//       storeCors: "http://localhost:5173", // ✅ Allow frontend
//       adminCors: "http://localhost:5173", // ✅ (If using Medusa admin panel)
//       authCors: process.env.AUTH_CORS!,
//       jwtSecret: process.env.JWT_SECRET || "supersecret",
//       cookieSecret: process.env.COOKIE_SECRET || "supersecret",
//     },
//   },
//   modules: {
    
//     [COMPANY_MODULE]: {
//       resolve: "./modules/company",
//     },
//     [QUOTE_MODULE]: {
//       resolve: "./modules/quote",
//     },
//     [APPROVAL_MODULE]: {
//       resolve: "./modules/approval",
//     },
//     [Modules.CACHE]: {
//       resolve: "@medusajs/medusa/cache-inmemory",
//     },
//     // ✅ Add M-Pesa payment provider
//     [Modules.PAYMENT]: {
//       // resolve: "./src/modules/mpesa/index.ts",
//       resolve: "@medusajs/payment",
//         options: {
//           consumerKey: process.env.MPESA_CONSUMER_KEY,
//           consumerSecret: process.env.MPESA_CONSUMER_SECRET,
//           shortCode: process.env.MPESA_SHORTCODE,
//           passKey: process.env.MPESA_PASSKEY,
//           callbackUrl: process.env.MPESA_CALLBACK_URL,
//         },
//       },
//     [Modules.WORKFLOW_ENGINE]: {
//       resolve: "@medusajs/medusa/workflow-engine-inmemory",
//     },
//   },
// });
import { QUOTE_MODULE } from "./src/modules/quote";
import { APPROVAL_MODULE } from "./src/modules/approval";
import { COMPANY_MODULE } from "./src/modules/company";
import { loadEnv, defineConfig, Modules } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV!, process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: "http://localhost:5173", // ✅ Allow frontend
      adminCors: "http://localhost:5173", // ✅ If using Medusa admin panel
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: {
    [COMPANY_MODULE]: {
      resolve: "./modules/company",
    },
    [QUOTE_MODULE]: {
      resolve: "./modules/quote",
    },
    [APPROVAL_MODULE]: {
      resolve: "./modules/approval",
    },
    [Modules.CACHE]: {
      resolve: "@medusajs/medusa/cache-inmemory",
    },
    [Modules.PAYMENT]: {
      resolve: "@medusajs/payment",
      options: {
        consumerKey: process.env.MPESA_CONSUMER_KEY,
        consumerSecret: process.env.MPESA_CONSUMER_SECRET,
        shortCode: process.env.MPESA_SHORTCODE,
        passKey: process.env.MPESA_PASSKEY,
        callbackUrl: process.env.MPESA_CALLBACK_URL,
      },
    },
    [Modules.WORKFLOW_ENGINE]: {
      resolve: "@medusajs/medusa/workflow-engine-inmemory",
    },
  },
});


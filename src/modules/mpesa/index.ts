import MpesaPaymentProviderService from "./service";
import { ModuleProvider, Modules } from "@medusajs/utils";

export default ModuleProvider(Modules.PAYMENT, {
  services: [MpesaPaymentProviderService],
});
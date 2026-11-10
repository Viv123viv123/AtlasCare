import express from "express";
import { handleStripeWebhook } from "../controllers/webhookController.js";

const webhookRouter = express.Router();

webhookRouter.post("/", handleStripeWebhook);

export default webhookRouter;


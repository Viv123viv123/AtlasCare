import Stripe from "stripe";
import Appointment from "../models/Appointment.js";
import ServiceAppointment from "../models/serviceAppointment.js";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" })
  : null;

/**
 * Handle incoming Stripe Webhook events
 * Route: POST /api/webhook
 * Body: Raw Buffer (express.raw({ type: "application/json" }))
 */
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe) {
    console.error("Stripe is not configured on the server.");
    return res.status(500).json({ error: "Stripe not configured on server" });
  }

  if (!endpointSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is missing from environment variables.");
    return res.status(500).json({ error: "Webhook secret not configured on server" });
  }

  let event;
  try {
    // Cryptographically verify that the event payload genuinely came from Stripe
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log(`🔔 Webhook: Checkout session completed for ID: ${session.id}, status: ${session.payment_status}`);

    if (session.payment_status === "paid") {
      const metadata = session.metadata || {};
      const appointmentType = metadata.appointmentType;
      const providerId = session.payment_intent || session.payment_intent_id || null;

      try {
        if (appointmentType === "doctor" || (!appointmentType && metadata.doctorId)) {
          // Idempotency check: if already processed, return 200 immediately without overwriting paidAt
          const existingAppt = await Appointment.findOne({
            $or: [
              { sessionId: session.id },
              ...(metadata.clerkUserId && metadata.doctorId
                ? [{ doctorId: metadata.doctorId, createdBy: metadata.clerkUserId, status: "Confirmed" }]
                : []),
            ],
          });

          if (existingAppt && existingAppt.payment?.status === "Paid") {
            console.log(`ℹ️ Webhook: Doctor appointment ${existingAppt._id} already marked Paid. Skipping duplicate event (Idempotent).`);
            return res.status(200).json({ received: true, alreadyProcessed: true });
          }

          // 1. Doctor Appointment Update
          let appt = await Appointment.findOneAndUpdate(
            { sessionId: session.id },
            {
              "payment.status": "Paid",
              "payment.providerId": providerId,
              status: "Confirmed",
              paidAt: new Date(),
            },
            { new: true }
          );

          // Fallback via metadata if sessionId lookup missed
          if (!appt && metadata.clerkUserId && metadata.doctorId) {
            appt = await Appointment.findOneAndUpdate(
              {
                doctorId: metadata.doctorId,
                createdBy: metadata.clerkUserId,
                status: "Pending",
              },
              {
                sessionId: session.id,
                "payment.status": "Paid",
                "payment.providerId": providerId,
                status: "Confirmed",
                paidAt: new Date(),
              },
              { new: true }
            );
          }

          if (appt) {
            console.log(`✅ Webhook: Doctor appointment ${appt._id} marked Confirmed & Paid`);
          } else {
            console.warn(`⚠️ Webhook: Doctor appointment not found for session ${session.id}`);
          }
        } else if (appointmentType === "service" || metadata.serviceId || metadata.appointmentId) {
          // Idempotency check: if already processed, return 200 immediately
          const existingService = await ServiceAppointment.findOne({
            $or: [
              { "payment.sessionId": session.id },
              ...(metadata.appointmentId ? [{ _id: metadata.appointmentId }] : []),
            ],
          });

          if (existingService && (existingService.payment?.status === "Paid" || existingService.payment?.status === "Confirmed")) {
            console.log(`ℹ️ Webhook: Service appointment ${existingService._id} already marked Paid. Skipping duplicate event (Idempotent).`);
            return res.status(200).json({ received: true, alreadyProcessed: true });
          }

          // 2. Service Appointment Update
          let appt = await ServiceAppointment.findOneAndUpdate(
            { "payment.sessionId": session.id },
            {
              $set: {
                "payment.status": "Paid",
                "payment.providerId": providerId || "",
                "payment.paidAt": new Date(),
                status: "Confirmed",
              },
            },
            { new: true }
          );

          // Fallback via metadata appointmentId
          if (!appt && metadata.appointmentId) {
            appt = await ServiceAppointment.findOneAndUpdate(
              { _id: metadata.appointmentId },
              {
                $set: {
                  "payment.sessionId": session.id,
                  "payment.status": "Paid",
                  "payment.providerId": providerId || "",
                  "payment.paidAt": new Date(),
                  status: "Confirmed",
                },
              },
              { new: true }
            );
          }

          if (appt) {
            console.log(`✅ Webhook: Service appointment ${appt._id} marked Confirmed & Paid`);
          } else {
            console.warn(`⚠️ Webhook: Service appointment not found for session ${session.id}`);
          }
        } else {
          // Fallback: If type was not specified, check idempotency first
          const existingDoc = await Appointment.findOne({ sessionId: session.id });
          if (existingDoc && existingDoc.payment?.status === "Paid") {
            console.log(`ℹ️ Webhook: Doctor appointment ${existingDoc._id} already Paid. Skipping.`);
            return res.status(200).json({ received: true, alreadyProcessed: true });
          }

          const existingSer = await ServiceAppointment.findOne({ "payment.sessionId": session.id });
          if (existingSer && (existingSer.payment?.status === "Paid" || existingSer.payment?.status === "Confirmed")) {
            console.log(`ℹ️ Webhook: Service appointment ${existingSer._id} already Paid. Skipping.`);
            return res.status(200).json({ received: true, alreadyProcessed: true });
          }

          let doctorAppt = await Appointment.findOneAndUpdate(
            { sessionId: session.id },
            {
              "payment.status": "Paid",
              "payment.providerId": providerId,
              status: "Confirmed",
              paidAt: new Date(),
            },
            { new: true }
          );

          if (!doctorAppt) {
            await ServiceAppointment.findOneAndUpdate(
              { "payment.sessionId": session.id },
              {
                $set: {
                  "payment.status": "Paid",
                  "payment.providerId": providerId || "",
                  "payment.paidAt": new Date(),
                  status: "Confirmed",
                },
              },
              { new: true }
            );
          }
        }
      } catch (dbErr) {
        console.error("Database error in Stripe webhook handler:", dbErr);
        return res.status(500).json({ error: "Failed to update database record" });
      }
    }
  }

  // Always return 200 to acknowledge receipt of event
  return res.status(200).json({ received: true });
};


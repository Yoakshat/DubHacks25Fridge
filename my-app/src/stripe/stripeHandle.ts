// create a saved card that they can use later
// server stuff
import express from "express";
import bodyParser from "body-parser";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// our server
const app = express()
app.use(bodyParser.json())

// -----------------------------
// 1) Create a Stripe Customer
// -----------------------------
app.post("/create_customer", async (req, res) => {
  try {
    const { email, metadata } = req.body;
    const customer = await stripe.customers.create({ email, metadata });
    res.json({ customer });
  } catch (err) {
    if (err instanceof Error) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
  }
});

// -----------------------------
// 2) Create a SetupIntent (save card for later)
// You have to attach this to a stripe customer
// -----------------------------
app.post("/create_setup_intent", async (req, res) => {
  try {
    const { customerId } = req.body;
    if (!customerId) return res.status(400).json({ error: "customerId required" });

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: setupIntent.client_secret });
  } catch (err) {
    if (err instanceof Error) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
  }
});

// ----
// 3) Attach a payment method id to customer
// ----
app.post("/attach_payment_method", async (req, res) => {
   const { customerId, paymentMethodId} = req.body;
   const pi = await stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });
    res.json(pi)
})

// -----------------------------
// 4) Charge a saved payment method (on-session)
// -----------------------------
app.post("/charge_saved_method", async (req, res) => {
  try {
    const { customerId, paymentMethodId, amount, currency = "usd" } = req.body;
    if (!customerId || !paymentMethodId || !amount) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const pi = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      payment_method: paymentMethodId,
      confirm: true, // attempt to charge immediately
    });

    res.json(pi);
  } catch (err) {
    if (err instanceof Error) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
  }
});



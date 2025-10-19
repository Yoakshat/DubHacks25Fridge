import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface SaveCardPopupProps {
  customerId: string; // your Stripe customer ID for the user
  onSuccess?: () => void;
  onClose?: () => void;
}

function InnerSaveCardForm({ customerId, onSuccess, onClose }: SaveCardPopupProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setMessage(null);

    try {
      // 1) Get SetupIntent client secret from backend
      const res = await fetch("http://localhost:3000/create_setup_intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      });
      const { clientSecret } = await res.json();
      if (!clientSecret) throw new Error("No client secret returned");

      // 2) Confirm SetupIntent using card details
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("CardElement not found");

      const confirmResult = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: "New User", // or get from signup form
          },
        },
      });

      if (confirmResult.error) {
        setMessage(confirmResult.error.message ?? "Failed to save card");
        setLoading(false);
        return;
      }

      // 3) Card saved successfully
      const setupIntent = confirmResult.setupIntent;
      const paymentMethodId = setupIntent.payment_method as string;
      //console.log("Saved payment method:", setupIntent.payment_method);
      // now attach this payment to the customer id (that is ideally in firebase)


      // Send it to backend to attach
      await fetch("http://localhost:3000/attach_payment_method", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, paymentMethodId }),
      });

      setMessage("Card saved successfully!");
      setLoading(false);
      onSuccess?.();
      // onClose?.();
    } catch (err) {
     if (err instanceof Error){
        console.error(err);
        setMessage(err.message || "Unexpected error");
        setLoading(false);
     }
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "white",
          padding: 24,
          borderRadius: 8,
          minWidth: 320,
        }}
      >
        <h2>Enter Card Details</h2>
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 6 }}>
          <CardElement options={{ hidePostalCode: false }} />
        </div>
        <button type="submit" disabled={!stripe || loading} style={{ marginTop: 12 }}>
          {loading ? "Saving…" : "Save Card"}
        </button>
        {message && <div style={{ marginTop: 8 }}>{message}</div>}
        <button type="button" onClick={onClose} style={{ marginTop: 8 }}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default function SaveCardPopup(props: SaveCardPopupProps) {
  return (
    <Elements stripe={stripePromise}>
      <InnerSaveCardForm {...props} />
    </Elements>
  );
}

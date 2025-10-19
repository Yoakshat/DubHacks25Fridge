// LoadCard.tsx
import { useLocation, useNavigate } from "react-router-dom";
import InnerSaveCardForm from "../components/StripePopup";

export default function LoadCard() {
  const location = useLocation();
  const navigate = useNavigate();

  const customerId = location.state?.customerId;

  return (
    <div className="p-6 min-h-screen flex justify-center items-center">
      <InnerSaveCardForm
        customerId={customerId}
        onSuccess={() => {
          console.log("Card saved!");
          navigate("/fridge"); // redirect after saving
        }}
        onClose={() => {
          console.log("User canceled");
          navigate("/signup"); // redirect if canceled
        }}
      />
    </div>
  );
}

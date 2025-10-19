import type { Auth } from "firebase/auth";
import AuthForm from "../components/AuthForm";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";


export default function Signup() {
  const navigate = useNavigate()
  
  // should get their kid's email too
  const handleSignUp = async (auth: Auth, email: string, password: string, kidEmail?: string) => {
    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User signed up:", user);

      // 2. Create Firestore user document with initial schema
      await setDoc(doc(db, "users", user.uid), {
        kidEmail: kidEmail, 
        email: email, 
        name: email.split("@")[0], // Default name from email, can be updated later
        isKid: true, // Default to true, can be updated later
        balance: 0,
        createdImages: [],
        ownedImages: [],
        fridge: {},
        receivedImages: [],
        createdAt: Date.now()
      });

      console.log("User document created in Firestore");

      // Create the customer using firebase
     const res = await fetch("http://localhost:3000/create_customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          metadata: { firebaseUid: user.uid } // optional mapping
        }),
      });
      const { customer } = await res.json();
    
      // Create a connected account for your kid so you can deposit funds
      await fetch("http://localhost:3000/create_connected", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kidEmail
        }),
      });

      // customer.id 
      navigate('/loadCard', {state: {'customerId': customer.id}})
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error signing up:", error.message);
      }
    }
  };

  return <AuthForm onSubmit={handleSignUp} submitLabel={"Sign Up"} signup={true}/>;
}
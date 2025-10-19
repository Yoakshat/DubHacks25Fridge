import React, { useState } from "react";
import type { Auth } from "firebase/auth"; 
import { auth } from "../firebase";

// like an interface: have to define both onSubmit and submitLabel
type AuthFormProps = {
  onSubmit: (a: Auth, email: string, password: string, kidEmail?: string) => Promise<void>;
  submitLabel: string; // e.g., "Sign Up" or "Login"
  signup: boolean; 
};

export default function AuthForm({ onSubmit, submitLabel, signup}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [kidEmail, setKidEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(signup){
      await onSubmit(auth, email, password, kidEmail);
    } else {
      await onSubmit(auth, email, password)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h3>Username</h3>
        <input
          type="text"
          placeholder="Type your email here"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <h3>Password</h3>
        <input
          type="password"
          placeholder="Type your password here"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {signup && <div>
        <h3>Your Kid's email</h3> 
        <input
          type="text"
          placeholder="Type their email here"
          value={kidEmail}
          onChange={(e) => setKidEmail(e.target.value)}
        />
      </div>}

      <button type="submit">{submitLabel}</button>
    </form>
  );
}

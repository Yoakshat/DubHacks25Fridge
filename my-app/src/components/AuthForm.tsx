import React, { useState } from "react";
import type { Auth } from "firebase/auth"; 
import { auth } from "../firebase";

// like an interface: have to define both onSubmit and submitLabel
type AuthFormProps = {
  onSubmit: (a: Auth, email: string, password: string) => Promise<void>;
  submitLabel: string; // e.g., "Sign Up" or "Login"
};

export default function AuthForm({ onSubmit, submitLabel }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(auth, email, password);
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

      <button type="submit">{submitLabel}</button>
    </form>
  );
}

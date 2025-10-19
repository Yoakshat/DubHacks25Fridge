import React, { useEffect, useState } from "react";
import { isCodeValid, getTimeRemaining } from "../utils/friendCode";

interface FriendCodeSectionProps {
  friendCode: string;
  codeExpiry?: number;
  onGenerateCode: () => void;
}

export default function FriendCodeSection({ friendCode, codeExpiry, onGenerateCode }: FriendCodeSectionProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    if (!isCodeValid(codeExpiry)) return;

    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(codeExpiry));
    }, 1000);

    return () => clearInterval(interval);
  }, [codeExpiry]);

  return (
    <div style={{ marginBottom: 30, padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
      <h3>Your Friend Code</h3>
      {friendCode && isCodeValid(codeExpiry) ? (
        <div>
          <div
            style={{
              fontSize: 24,
              fontWeight: "bold",
              letterSpacing: 2,
              padding: 10,
              backgroundColor: "#f0f0f0",
              borderRadius: 4,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            {friendCode}
          </div>
          <p style={{ fontSize: 14, color: "#666" }}>
            Expires in: <strong>{timeRemaining}</strong>
          </p>
        </div>
      ) : (
        <p style={{ color: "#666", marginBottom: 10 }}>No active friend code</p>
      )}
      <button
        onClick={onGenerateCode}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Generate New Code
      </button>
    </div>
  );
}
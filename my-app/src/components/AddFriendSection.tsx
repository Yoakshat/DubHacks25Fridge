import React, { useState } from "react";

interface AddFriendSectionProps {
  onAddFriend: (code: string) => void;
}

export default function AddFriendSection({ onAddFriend }: AddFriendSectionProps) {
  const [inputCode, setInputCode] = useState("");

  const handleSubmit = () => {
    if (inputCode.trim()) {
      onAddFriend(inputCode.trim().toUpperCase());
      setInputCode("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div style={{ marginBottom: 30, padding: 20, border: "1px solid #ddd", borderRadius: 8 }}>
      <h3>Add a Friend</h3>
      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          placeholder="Enter friend code"
          maxLength={8}
          style={{
            flex: 1,
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 4,
            fontSize: 16,
            textTransform: "uppercase",
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!inputCode.trim()}
          style={{
            padding: "10px 20px",
            backgroundColor: inputCode.trim() ? "#28a745" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: inputCode.trim() ? "pointer" : "not-allowed",
          }}
        >
          Add Friend
        </button>
      </div>
    </div>
  );
}
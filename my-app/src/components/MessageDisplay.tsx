import React from "react";

interface MessageDisplayProps {
  type: "success" | "error";
  text: string;
}

export default function MessageDisplay({ type, text }: MessageDisplayProps) {
  return (
    <div
      style={{
        padding: 10,
        marginBottom: 20,
        borderRadius: 4,
        backgroundColor: type === "success" ? "#d4edda" : "#f8d7da",
        color: type === "success" ? "#155724" : "#721c24",
        border: `1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
      }}
    >
      {text}
    </div>
  );
}
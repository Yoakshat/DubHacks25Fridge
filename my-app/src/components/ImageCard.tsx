import React, { useState } from "react";
import type { ImageData } from "../types/image";

interface ImageCardProps {
  image: ImageData & { id: string };
}

export default function ImageCard({ image }: ImageCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      style={{
        position: "relative",
        border: "1px solid #ddd",
        borderRadius: 8,
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s",
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={() => setShowTooltip(true)}
      onTouchEnd={() => setShowTooltip(false)}
    >
      <img
        src={image.url}
        alt="Created artwork"
        style={{
          width: "100%",
          height: 200,
          objectFit: "cover",
        }}
      />

      {showTooltip && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(0, 0, 0, 0.85)",
            color: "white",
            padding: 10,
            fontSize: 12,
          }}
        >
          <div><strong>Dimensions:</strong> {image.width} × {image.height}px</div>
          <div><strong>Created:</strong> {formatDate(image.createdAt)}</div>
          <div><strong>Times Bought:</strong> {image.boughtBy.length}</div>
          <div style={{ fontSize: 10, color: "#aaa", marginTop: 4 }}>
            ID: {image.id.substring(0, 8)}...
          </div>
        </div>
      )}
    </div>
  );
}
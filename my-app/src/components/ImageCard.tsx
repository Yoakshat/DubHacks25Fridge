import { useState } from "react";
import type { ImageData } from "../types/image";

interface ImageCardProps {
  image: ImageData & { id: string };
  onClick?: () => void;
  size?: number;
}

export default function ImageCard({ image, onClick, size }: ImageCardProps) {
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
      onClick={onClick}
    >
      <img
        src={image.url}
        alt="Created artwork"
        style={{
          width: "100%",
          height: size || 200,
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
          <div><strong>Created:</strong> {formatDate(image.createdAt)}</div>
          <div><strong>Times Bought:</strong> {image.boughtBy.length}</div>
        </div>
      )}
    </div>
  );
}
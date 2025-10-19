interface FridgeSpotProps {
  spotId: number;
  imageUrl?: string;
  top: number;
  left: number;
  size: number;
  isSelecting: boolean;
  isOccupied: boolean;
  onSelect: () => void;
}

export default function FridgeSpot({
  spotId,
  imageUrl,
  top,
  left,
  size,
  isSelecting,
  isOccupied,
  onSelect
}: FridgeSpotProps) {
  
  // If there's an image, just show it
  if (imageUrl && !isSelecting) {
    return (
      <div
        style={{
          position: "absolute",
          top: `${top}px`,
          left: `${left}px`,
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        <img
          src={imageUrl}
          alt={`Fridge magnet ${spotId}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            border: "2px solid white",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
          }}
        />
      </div>
    );
  }

  // If selecting mode, show clickable spots
  if (isSelecting) {
    return (
      <button
        onClick={onSelect}
        disabled={isOccupied}
        style={{
          position: "absolute",
          top: `${top}px`,
          left: `${left}px`,
          width: `${size}px`,
          height: `${size}px`,
          border: isOccupied ? "3px dashed #ccc" : "3px dashed #4CAF50",
          borderRadius: "10px",
          backgroundColor: isOccupied 
            ? "rgba(200, 200, 200, 0.3)" 
            : "rgba(76, 175, 80, 0.2)",
          cursor: isOccupied ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          color: "#666",
          fontWeight: "bold",
          padding: 0,
          transition: "all 0.2s"
        }}
      >
        {isOccupied ? "Taken" : `Spot ${spotId + 1}`}
      </button>
    );
  }

  // Empty spot when not selecting
  return null;
}
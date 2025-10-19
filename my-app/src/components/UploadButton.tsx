import React, { useState } from "react";
import { uploadImage } from "../utils/uploadImage";
import { useAuth } from "../hooks/useAuth";

interface UploadButtonProps {
  canvas: HTMLCanvasElement | null;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ canvas }) => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadData, setUploadData] = useState<{ url: string; imageId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!canvas || !user) return;
    setLoading(true);
    setError(null);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setError("Failed to create image blob");
        setLoading(false);
        return;
      }
      
      const file = new File([blob], "scanned.png", { type: "image/png" });
      
      try {
        const result = await uploadImage(file, user.uid);
        setUploadData(result);
        console.log("Upload successful:", result);
      } catch (err) {
        console.error("Upload error:", err);
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setLoading(false);
      }
    }, "image/png");
  };

  if (authLoading) {
    return <div style={{ marginTop: 20 }}>Loading...</div>;
  }

  if (!user) {
    return <div style={{ marginTop: 20 }}>Please log in to upload images</div>;
  }

  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={handleUpload} disabled={!canvas || loading}>
        {loading ? "Uploading..." : "Upload Scanned Image"}
      </button>

      {error && (
        <div style={{ color: "red", marginTop: 10 }}>
          <p>Error: {error}</p>
        </div>
      )}

      {uploadData && (
        <div style={{ marginTop: 10, color: "green" }}>
          <p>✓ Success! Image uploaded and saved to your profile.</p>
          <img src={uploadData.url} alt="Uploaded file" style={{ maxWidth: 300, marginTop: 10 }} />
          <p style={{ fontSize: 12, color: "#666" }}>Image ID: {uploadData.imageId}</p>
        </div>
      )}
    </div>
  );
};
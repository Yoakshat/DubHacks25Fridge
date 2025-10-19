import React, { useState } from "react";
import { uploadImage } from "../utils/uploadImage";

interface UploadButtonProps {
  canvas: HTMLCanvasElement | null;
  userId: string;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ canvas, userId }) => {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!canvas) return;
    setLoading(true);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "scanned.png", { type: "image/png" });
      try {
        const uploadedUrl = await uploadImage(file, userId);
        setUrl(uploadedUrl);
        console.log("Uploaded URL:", uploadedUrl);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, "image/png");
  };

  return (
    <div style={{ marginTop: 20 }}>
      <button onClick={handleUpload} disabled={!canvas || loading}>
        {loading ? "Uploading..." : "Upload Scanned Image"}
      </button>

      {url && (
        <div>
          <p>File uploaded successfully!</p>
          <img src={url} alt="Uploaded file" style={{ maxWidth: 300 }} />
        </div>
      )}
    </div>
  );
};

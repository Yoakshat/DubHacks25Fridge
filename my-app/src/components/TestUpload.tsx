// src/components/TestUpload.tsx
import React, { useState } from "react";
import { uploadImage } from "../utils/uploadImage";

export default function TestUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const userId = "demoUser"; // for testing, replace with actual Firebase UID if you have auth

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const uploadedUrl = await uploadImage(file, userId);
      setUrl(uploadedUrl);
      console.log("Uploaded URL:", uploadedUrl);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div>
      <input type="file" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={loading || !file}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {url && (
        <div>
          <p>File uploaded successfully!</p>
          <img src={url} alt="Uploaded file" style={{ maxWidth: 300 }} />
        </div>
      )}
    </div>
  );
}

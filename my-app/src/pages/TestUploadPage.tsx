// src/pages/TestUploadPage.tsx
import React, { useState } from "react";
import { uploadImage } from "../utils/uploadImage";

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const userId = "demoUser"; // for testing, you can use a fixed string

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const uploadedUrl = await uploadImage(file, userId);
      setUrl(uploadedUrl);
      console.log("Uploaded URL:", uploadedUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Firebase Test Upload</h1>
      <input
        type="file"
        onChange={(e) => e.target.files && setFile(e.target.files[0])}
      />
      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {url && (
        <div style={{ marginTop: 20 }}>
          <p>Upload successful!</p>
          <img src={url} alt="Uploaded file" style={{ maxWidth: 300 }} />
        </div>
      )}
    </div>
  );
}

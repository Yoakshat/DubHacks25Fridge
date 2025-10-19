import { useState } from "react";
import { Scanner } from "../components/Scanner";
import { UploadButton } from "../components/UploadButton";

export default function ScanPage() {
  const [scannedCanvas, setScannedCanvas] = useState<HTMLCanvasElement | null>(null);

  return (
    <div style={{ padding: 20 }}>
      <h1>Scan a Picture</h1>
      <Scanner onScan={setScannedCanvas} />

      <UploadButton canvas={scannedCanvas} />
    </div>
  );
}

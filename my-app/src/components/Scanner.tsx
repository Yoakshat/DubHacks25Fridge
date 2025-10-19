import { useEffect, useState, useRef } from "react";

interface ScannerProps {
  onScan: (canvas: HTMLCanvasElement) => void; // callback for scanned result
}

export const Scanner: React.FC<ScannerProps> = ({ onScan }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Load jscanify
  useEffect(() => {
    if ((window as any).jscanify) {
      setScanner(new (window as any).jscanify());
    } else {
      console.error(
        "jScanify not loaded. Make sure the script tag is in index.html."
      );
    }
  }, []);

  // Camera access
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(console.error);
  }, []);

  // Handle uploaded file: show it immediately in DOM
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.style.maxWidth = "400px";
    img.style.display = "block";
    img.alt = "Uploaded file";

    const fileContainer = document.getElementById("uploaded-file-container");
    if (fileContainer) {
      fileContainer.innerHTML = "";
      fileContainer.appendChild(img);
    }
  };

  // Scan camera frame
  const handleCaptureFromVideo = () => {
    if (!scanner || !videoRef.current) return;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = videoRef.current.videoWidth;
    tempCanvas.height = videoRef.current.videoHeight;
    const ctx = tempCanvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    const scanned = scanner.extractPaper(tempCanvas, 386, 500);

    containerRef.current!.innerHTML = "";
    containerRef.current!.append(scanned);

    onScan(scanned);
  };

  // Scan uploaded file
  const handleScanFile = () => {
    if (!scanner || !selectedFile) return;
    const img = new Image();
    img.src = URL.createObjectURL(selectedFile);
    img.onload = () => { // TODO: Add error message if extractPaper fails
      const scannedCanvas = scanner.extractPaper(img, 386, 500);
      containerRef.current!.innerHTML = "";
      containerRef.current!.append(scannedCanvas);
      onScan(scannedCanvas);
    };
  };

  return (
    <div>
      <h3>Camera Scan</h3>
      <video ref={videoRef} autoPlay width={400} height={300} />
      <button onClick={handleCaptureFromVideo} disabled={!scanner}>
        Scan from Camera
      </button>

      <h3>File Scan</h3>
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          e.target.files && handleFileSelect(e.target.files[0])
        }
      />
      <button onClick={handleScanFile} disabled={!scanner || !selectedFile}>
        Scan Uploaded File
      </button>

      <div id="uploaded-file-container" style={{ marginTop: 10 }}></div>
      <div ref={containerRef} style={{ marginTop: 20 }}></div>
    </div>
  );
};

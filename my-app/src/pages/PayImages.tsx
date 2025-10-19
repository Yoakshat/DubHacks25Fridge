import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import type { ImageData } from "../types/image";
import type { UserData } from "../types/user";

export default function PayImages() {
  const { user, loading: authLoading } = useAuth();
  const [images, setImages] = useState<(ImageData & { id: string })[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [amount, setAmount] = useState(0); // coins to pay for current image
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchImages = async () => {
      try {
        setLoading(true);

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          setError("User profile not found");
          setLoading(false);
          return;
        }

        const userData = userDoc.data() as UserData;
        const receivedImageIds = (userData.receivedImages || []).map(img => img.imageId); // get image ids

        if (receivedImageIds.length === 0) {
          setImages([]);
          setLoading(false);
          return;
        }

        const imagePromises = receivedImageIds.map(async (imageId) => {
          const imageDoc = await getDoc(doc(db, "images", imageId));
          if (imageDoc.exists()) {
            return { id: imageId, ...imageDoc.data() } as ImageData & { id: string };
          }
          return null;
        });

        const fetchedImages = await Promise.all(imagePromises);
        const validImages = fetchedImages.filter((img): img is ImageData & { id: string } => img !== null);
        setImages(validImages);

      } catch (err) {
        console.error("Error fetching images:", err);
        setError(err instanceof Error ? err.message : "Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [user]);

  const handleNext = async () => {
    if (!user || images.length === 0) return;
    const currentImage = images[currentIndex];

    try {
      const userRef = doc(db, "users", user.uid);

      // 1️⃣ Get connected account id from kidEmail
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data() as UserData;
      const customerId = userData.customerId
      // harcoded sandbox value (for now)
      const destinationId = "acct_1SJuciDzEi8vMoyS"
      //const destinationId = userData.kidAccountId
      

      if (!destinationId) throw new Error("Kid id not found. Kid sad he doesn't get money :(");

      // 2️⃣ Send money via backend
      // what is
      await fetch("http://localhost:3000/send_money", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customerId, // should store this in user doc
          amount: amount,
          currency: "usd",
          destinationAccountId: destinationId,
        }),
      });

     const imageToRemove = userData.receivedImages.find(img => img.imageId === currentImage.id);

      // 3️⃣ Move image from received -> owned
      await updateDoc(userRef, {
        receivedImages: arrayRemove(imageToRemove),
        ownedImages: arrayUnion(currentImage.id),
      });

      // 4️⃣ Reset amount and move to next image
      setAmount(0);
      setCurrentIndex(prev => prev + 1);

    } catch (err) {
      console.error("Error sending money or updating image:", err);
      setError(err instanceof Error ? err.message : "Failed to process payment");
    }
  };

  if (authLoading || loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>Error: {error}</div>;
  if (images.length === 0 || currentIndex >= images.length) return <div style={{ padding: 20 }}>No more images to view!</div>;

  const currentImage = images[currentIndex];

  return (
    <div style={{ maxWidth: 500, margin: "20px auto", textAlign: "center" }}>
      <h2>Slide through your images</h2>
      <img
        src={currentImage.url}
        alt={`Image ${currentIndex + 1}`}
        style={{ width: "100%", borderRadius: 12, marginBottom: 20 }}
      />

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
          Choose amount to pay (coins)
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          style={{ width: "100%" }}
        />
        <div>{amount} coins</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
          disabled={currentIndex === 0}
          style={{ padding: "10px 20px", borderRadius: 6, cursor: currentIndex === 0 ? "not-allowed" : "pointer" }}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          style={{ padding: "10px 20px", borderRadius: 6 }}
        >
          Confirm & Next
        </button>
      </div>

      <p style={{ marginTop: 12 }}>
        {currentIndex + 1} / {images.length}
      </p>
    </div>
  );
}

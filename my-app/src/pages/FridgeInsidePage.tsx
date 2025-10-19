import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import ImageCard from "../components/ImageCard";
import type { ImageData } from "../types/image";
import type { UserData } from "../types/user";

export default function FridgeInsidePage() {
  const { user, loading: authLoading } = useAuth();
  const [images, setImages] = useState<(ImageData & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchImages = async () => {
      try {
        setLoading(true);
        
        // 1. Get user document to find createdImages array
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (!userDoc.exists()) {
          setError("User profile not found");
          setLoading(false);
          return;
        }

        const userData = userDoc.data() as UserData;
        const createdImageIds = userData.createdImages || [];

        if (createdImageIds.length === 0) {
          setImages([]);
          setLoading(false);
          return;
        }

        // 2. Fetch all image documents
        const imagePromises = createdImageIds.map(async (imageId) => {
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

  if (authLoading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (!user) {
    return <div style={{ padding: 20 }}>Please log in to view your images</div>;
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Loading your images...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: "red" }}>Error: {error}</div>;
  }

  if (images.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <h2>My Created Images</h2>
        <p>You haven't created any images yet. Upload your first image to get started!</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>My Created Images</h2>
      <p style={{ marginBottom: 20, color: "#666" }}>
        {images.length} image{images.length !== 1 ? "s" : ""}
      </p>
      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 20,
        }}
      >
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
    </div>
  );
}
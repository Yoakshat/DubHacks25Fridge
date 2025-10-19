// src/utils/uploadImage.ts
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, arrayUnion, collection } from "firebase/firestore";
import { storage, db } from "../firebase";

export async function uploadImage(file: File, userId: string) {
  // 1. Generate a unique image ID
  const imageId = doc(collection(db, "images")).id; // Generate ID without creating doc yet
  
  // 2. Upload to Storage at images/{imageId}
  const storageRef = ref(storage, `images/${imageId}`);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  
  // 3. Get image dimensions (optional but included in your schema)
  const dimensions = await getImageDimensions(file);
  
  // Validate dimensions
  if (!dimensions.width || !dimensions.height || !isFinite(dimensions.width) || !isFinite(dimensions.height)) {
    throw new Error("Invalid image dimensions");
  }
  
  // 4. Create image document in Firestore
  const imageData = {
    url,
    ownerId: userId,
    createdAt: Date.now(),
    boughtBy: [],
    metadata: {
      width: dimensions.width,
      height: dimensions.height,
    }
  };
  
  console.log("Creating image document with data:", imageData);
  
  await setDoc(doc(db, "images", imageId), imageData);
  
  // 5. Update user document to add imageId to createdImages and ownedImages
  const userRef = doc(db, "users", userId);
  try {
    await setDoc(userRef, {
      createdImages: arrayUnion(imageId),
      ownedImages: arrayUnion(imageId)
    }, { merge: true });
  } catch (userUpdateError) {
    console.error("Failed to update user document:", userUpdateError);
    throw new Error(`Failed to update user profile: ${userUpdateError}`);
  }
  
  return { url, imageId };
}

// Helper function to get image dimensions
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
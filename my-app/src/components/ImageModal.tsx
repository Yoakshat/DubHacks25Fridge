import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import type { ImageData } from "../types/image";
import type { UserData } from "../types/user";

interface ImageModalProps {
  image: ImageData & { id: string };
  currentUserId: string;
  onClose: () => void;
}

export default function ImageModal({ image, currentUserId, onClose }: ImageModalProps) {
  const [friends, setFriends] = useState<{ uid: string; name: string }[]>([]);
  const [selectedFriend, setSelectedFriend] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUserId));
        if (!userDoc.exists()) return;

        const userData = userDoc.data() as UserData;
        const friendIds = userData.friends || [];

        const friendPromises = friendIds.map(async (friendId) => {
          const friendDoc = await getDoc(doc(db, "users", friendId));
          if (friendDoc.exists()) {
            return { uid: friendId, name: (friendDoc.data() as UserData).name };
          }
          return null;
        });

        const fetchedFriends = await Promise.all(friendPromises);
        setFriends(fetchedFriends.filter((f): f is { uid: string; name: string } => f !== null));
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [currentUserId]);

  const handlePrint = () => {
    // Create a new window with the image for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Image</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
            img { max-width: 100%; max-height: 100vh; }
            @media print { body { margin: 0; } img { max-width: 100%; height: auto; } }
          </style>
        </head>
        <body>
          <img src="${image.url}" alt="Artwork" id="printImg" />
          <script>
            const img = document.getElementById('printImg');
            img.onload = function() {
              setTimeout(() => {
                window.print();
              }, 250);
            };
            // Fallback if image is already cached
            if (img.complete) {
              setTimeout(() => {
                window.print();
              }, 250);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleShare = async () => {
    if (!selectedFriend) {
      setMessage("Please select a friend");
      return;
    }

    setSending(true);
    setMessage("");

    try {
      // Check if friend already has this image
      const friendDoc = await getDoc(doc(db, "users", selectedFriend));
      if (!friendDoc.exists()) {
        setMessage("Friend not found");
        setSending(false);
        return;
      }

      const friendData = friendDoc.data() as UserData;
      
      // Check if they already have it
      const alreadyHas = 
        friendData.createdImages?.includes(image.id) ||
        friendData.ownedImages?.includes(image.id) ||
        friendData.receivedImages?.some(ri => ri.imageId === image.id);

      if (alreadyHas) {
        setMessage("This friend already has this image!");
        setSending(false);
        return;
      }

      // Add to friend's receivedImages
      await updateDoc(doc(db, "users", selectedFriend), {
        receivedImages: arrayUnion({
          imageId: image.id,
          from: currentUserId,
          receivedAt: Date.now()
        })
      });

      setMessage("Image sent successfully! 🎉");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error sharing image:", error);
      setMessage("Failed to send image");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: 20
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          maxWidth: 800,
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(0, 0, 0, 0.5)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: 30,
            height: 30,
            cursor: "pointer",
            fontSize: 18,
            zIndex: 1
          }}
        >
          ×
        </button>

        {/* Image */}
        <img
          src={image.url}
          alt="Artwork"
          style={{
            width: "100%",
            maxHeight: "50vh",
            objectFit: "contain",
            display: "block"
          }}
        />

        {/* Actions */}
        <div style={{ padding: 20 }}>
          <h3 style={{ marginTop: 0 }}>Actions</h3>
          
          {/* Print Button */}
          <button
            onClick={handlePrint}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 12,
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 16,
              fontWeight: "bold"
            }}
          >
            🖨️ Print
          </button>

          {/* Share Section */}
          <div style={{ marginTop: 20 }}>
            <h4 style={{ marginBottom: 10 }}>Share with a friend</h4>
            
            {loading ? (
              <p>Loading friends...</p>
            ) : friends.length === 0 ? (
              <p style={{ color: "#666" }}>No friends yet. Add friends to share images!</p>
            ) : (
              <>
                <select
                  value={selectedFriend}
                  onChange={(e) => setSelectedFriend(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 10,
                    marginBottom: 12,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    fontSize: 14
                  }}
                >
                  <option value="">Select a friend...</option>
                  {friends.map((friend) => (
                    <option key={friend.uid} value={friend.uid}>
                      {friend.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleShare}
                  disabled={!selectedFriend || sending}
                  style={{
                    width: "100%",
                    padding: 12,
                    backgroundColor: selectedFriend ? "#4CAF50" : "#ccc",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: selectedFriend && !sending ? "pointer" : "not-allowed",
                    fontSize: 16,
                    fontWeight: "bold"
                  }}
                >
                  {sending ? "Sending..." : "📤 Send to Friend"}
                </button>
              </>
            )}

            {message && (
              <div
                style={{
                  marginTop: 12,
                  padding: 10,
                  backgroundColor: message.includes("successfully") ? "#d4edda" : "#f8d7da",
                  color: message.includes("successfully") ? "#155724" : "#721c24",
                  borderRadius: 6,
                  fontSize: 14
                }}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
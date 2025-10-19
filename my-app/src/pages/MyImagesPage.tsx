import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { ImageData } from "../types/image";
import type { UserData } from "../types/user";

const IMAGES_PER_PAGE = 4; // 2x2 grid per page

export default function MyImagesPage() {
  const { user, loading: authLoading } = useAuth();
  const [images, setImages] = useState<(ImageData & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const navigate = useNavigate();

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
        
        // Combine createdImages and ownedImages, remove duplicates
        const allImageIds = [
          ...(userData.createdImages || []),
          ...(userData.ownedImages || [])
        ];
        const uniqueImageIds = [...new Set(allImageIds)];

        if (uniqueImageIds.length === 0) {
          setImages([]);
          setLoading(false);
          return;
        }

        // Fetch all image documents
        const imagePromises = uniqueImageIds.map(async (imageId) => {
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

  const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
  const startIdx = currentPage * IMAGES_PER_PAGE;
  const endIdx = startIdx + IMAGES_PER_PAGE;
  const currentImages = images.slice(startIdx, endIdx);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const handleImageClick = (image: ImageData & { id: string }) => {
    navigate('/fridge', { state: { selectedImage: image } });
  };

  if (authLoading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (!user) {
    return <div style={{ padding: 20 }}>Please log in to view your images</div>;
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Loading your scrapbook...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: "red" }}>Error: {error}</div>;
  }

  if (images.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        padding: 20 
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>My Scrapbook</h2>
          <p>You don't have any images yet. Create or receive images to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: 40,
      backgroundColor: '#f5f5f5'
    }}>
      <h2 style={{ marginBottom: 20, color: '#333' }}>My Scrapbook</h2>
      <p style={{ marginBottom: 30, color: '#666' }}>
        Click an image to add it to your fridge • Page {currentPage + 1} of {totalPages}
      </p>

      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 40
      }}>
        {/* Previous Button */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0 || isFlipping}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 48,
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            opacity: currentPage === 0 ? 0.3 : 1,
            padding: 10,
            color: '#333',
            transition: 'opacity 0.2s'
          }}
        >
          ‹
        </button>

        {/* Scrapbook */}
        <div style={{
          position: 'relative',
          width: 800,
          height: 900,
          perspective: '1500px'
        }}>
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s',
            transform: isFlipping ? 'rotateY(-15deg)' : 'rotateY(0deg)'
          }}>
            {/* Scrapbook background */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundImage: 'url(src/assets/scrapbook.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 8,
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            }}>
              {/* Image grid overlay */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-63%, -55%)',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 40,
                padding: 60,
                width: '85%',
                maxWidth: 375
              }}>
                {currentImages.map((image, idx) => (
                  <div
                    key={image.id}
                    onClick={() => handleImageClick(image)}
                    style={{
                      marginLeft: idx % 2 === 0 ? '0px' : '60px',
                      position: 'relative',
                      aspectRatio: '1',
                      cursor: 'pointer',
                      transform: `rotate(${(idx % 2 === 0 ? -2 : 2) + (idx > 1 ? 1 : -1)}deg)`,
                      transition: 'transform 0.2s, boxShadow 0.2s',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = `rotate(0deg) scale(1.05)`;
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
                      e.currentTarget.style.zIndex = '10';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = `rotate(${(idx % 2 === 0 ? -2 : 2) + (idx > 1 ? 1 : -1)}deg)`;
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                      e.currentTarget.style.zIndex = '1';
                    }}
                  >
                    {/* Polaroid-style frame */}
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'white',
                      padding: 8,
                      paddingBottom: 24,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}>
                      <img
                        src={image.url}
                        alt={`Image ${image.id}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages - 1 || isFlipping}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 48,
            cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage >= totalPages - 1 ? 0.3 : 1,
            padding: 10,
            color: '#333',
            transition: 'opacity 0.2s'
          }}
        >
          ›
        </button>
      </div>

      {/* Page indicators */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginTop: 30
      }}>
        {Array.from({ length: totalPages }).map((_, idx) => (
          <div
            key={idx}
            onClick={() => {
              if (!isFlipping) {
                setIsFlipping(true);
                setTimeout(() => {
                  setCurrentPage(idx);
                  setIsFlipping(false);
                }, 300);
              }
            }}
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: currentPage === idx ? '#4CAF50' : '#ddd',
              cursor: 'pointer',
              transition: 'backgroundColor 0.3s',
              border: '2px solid #999'
            }}
          />
        ))}
      </div>
    </div>
  );
}
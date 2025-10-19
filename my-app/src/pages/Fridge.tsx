import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import FridgeSpot from "../components/FridgeSpot";
import ImageCard from "../components/ImageCard";
import type { UserData, FridgeItem } from "../types/user";
import type { ImageData } from "../types/image";

function getPositions(numSpots: number, fridgeWidth: number, imageSize: number, gap: number) {
  const magnetPos: number[][] = [];
  const padding = 82;
  const perRow = 2; // 2 wide
  
  for (let i = 0; i < numSpots; i++) {
    const row = Math.floor(i / perRow); 
    const col = i % perRow;

    const top = 265 + row * (imageSize + gap);
    const left = 10 + padding + col * (imageSize + gap);

    magnetPos.push([top, left]);
  }

  return magnetPos;
}

const NUM_SPOTS = 6; // 3 tall x 2 wide
const FRIDGE_WIDTH = 400;
const IMG_SIZE = 100;
const GAP = 20;

export default function Fridge() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);
  const [imageDataMap, setImageDataMap] = useState<Map<string, ImageData>>(new Map());
  const [selectedImage, setSelectedImage] = useState<(ImageData & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const fridgePositions = getPositions(NUM_SPOTS, FRIDGE_WIDTH, IMG_SIZE, GAP);

  // Get the selected image from navigation state
  useEffect(() => {
    const state = window.history.state?.usr;
    if (state?.selectedImage) {
      setSelectedImage(state.selectedImage);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (!userDoc.exists()) {
          setLoading(false);
          return;
        }

        const userData = userDoc.data() as UserData;
        const fridge = Array.isArray(userData.fridge) ? userData.fridge : [];
        setFridgeItems(fridge);

        // Fetch all image data for images on the fridge
        const imageIds = fridge.map(item => item.id);
        const imageMap = new Map<string, ImageData>();

        if (imageIds.length > 0) {
          const imagePromises = imageIds.map(async (imageId) => {
            const imageDoc = await getDoc(doc(db, "images", imageId));
            if (imageDoc.exists()) {
              imageMap.set(imageId, imageDoc.data() as ImageData);
            }
          });

          await Promise.all(imagePromises);
        }

        setImageDataMap(imageMap);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSpotSelect = async (spotIndex: number) => {
    if (!selectedImage || !user || placing) return;

    // Check if this image is already on the fridge
    const alreadyPlaced = fridgeItems.some(item => item.id === selectedImage.id);
    if (alreadyPlaced) {
      alert("This image is already on your fridge!");
      return;
    }

    setPlacing(true);

    try {
      const [top, left] = fridgePositions[spotIndex];
      
      const newFridgeItem: FridgeItem = {
        id: selectedImage.id,
        x: left,
        y: top,
        width: IMG_SIZE,
        height: IMG_SIZE,
      };

      const updatedFridge = [...fridgeItems, newFridgeItem];

      await updateDoc(doc(db, "users", user.uid), {
        fridge: updatedFridge
      });

      setFridgeItems(updatedFridge);
      
      // Add the new image to the imageDataMap
      const newImageMap = new Map(imageDataMap);
      newImageMap.set(selectedImage.id, {
        url: selectedImage.url,
        ownerId: selectedImage.ownerId,
        createdAt: selectedImage.createdAt,
        boughtBy: selectedImage.boughtBy,
        width: selectedImage.width,
        height: selectedImage.height
      });
      setImageDataMap(newImageMap);
      
      setSelectedImage(null);
      alert("Image added to fridge! 🎨");
    } catch (error) {
      console.error("Error adding to fridge:", error);
      alert("Failed to add image to fridge");
    } finally {
      setPlacing(false);
    }
  };

  const getImageAtPosition = (top: number, left: number): (ImageData & { id: string }) | undefined => {
    if (!Array.isArray(fridgeItems)) return undefined;
    
    const item = fridgeItems.find(
      fridgeItem => fridgeItem.y === top && fridgeItem.x === left
    );
    
    if (item) {
      const imageData = imageDataMap.get(item.id);
      if (imageData) {
        return { id: item.id, ...imageData };
      }
    }
    return undefined;
  };

  if (authLoading || loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (!user) {
    return <div style={{ padding: 20 }}>Please log in to view your fridge</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>My Fridge</h2>
      
      {selectedImage ? (
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: "#666", marginBottom: 10 }}>
            Click a spot to place your image:
          </p>
          <div style={{ 
            padding: 10, 
            backgroundColor: "#e3f2fd", 
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            gap: 10
          }}>
            <img 
              src={selectedImage.url} 
              alt="Selected" 
              style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
            />
            <div>
              <strong>Selected Image</strong>
              <button
                onClick={() => {
                  setSelectedImage(null);
                }}
                style={{
                  marginLeft: 10,
                  padding: "4px 8px",
                  fontSize: 12,
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p style={{ marginBottom: 20 }}>
          <button
            onClick={() => navigate('/myimages')}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: "bold"
            }}
          >
            + Add Image to Fridge
          </button>
        </p>
      )}

      {/* Fridge Display */}
      <div 
        className='fridge'
        style={{ 
          position: "relative", 
          width: `${FRIDGE_WIDTH}px`,
          margin: "0 auto"
        }}
      >   
        <img 
          src="src/assets/no_bg_fridge.jpg" 
          alt="Fridge"
          style={{ width: '100%', height: 'auto' }} 
        />
        
        {/* Clickable Door Area */}
        <div
          onClick={() => navigate('/fridgeInside')}
          style={{
            position: 'absolute',
            top: '30%',
            left: '5%',
            width: '35%',
            height: '50%',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            opacity: 0,
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
          title="Click to open fridge"
        >
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            border: '2px dashed rgba(255, 255, 255, 0.5)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '0 0 4px rgba(0,0,0,0.8)'
          }}>
            Open Door
          </div>
        </div>
        
        {/* Render all spots */}
        {fridgePositions.map((position, index) => {
          const [top, left] = position;
          const imageAtSpot = getImageAtPosition(top, left);
          
          return imageAtSpot ? (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: top,
                left: left,
                width: IMG_SIZE,
                height: IMG_SIZE,
              }}
            >
              <div style={{ width: '100%', height: '100%' }}>
                <ImageCard image={imageAtSpot} size={IMG_SIZE} />
              </div>
            </div>
          ) : (
            <FridgeSpot
              key={index}
              spotId={index}
              imageUrl={undefined}
              top={top}
              left={left}
              size={IMG_SIZE}
              isSelecting={!!selectedImage}
              isOccupied={false}
              onSelect={() => handleSpotSelect(index)}
            />
          );
        })}
      </div>
    </div>
  );
}
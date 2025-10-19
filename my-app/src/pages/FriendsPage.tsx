import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { generateFriendCode, addFriendByCode } from "../utils/friendCode";
import FriendCodeSection from "../components/FriendCodeSection";
import AddFriendSection from "../components/AddFriendSection";
import FriendsList from "../components/FriendsList";
import MessageDisplay from "../components/MessageDisplay";
import type { UserData } from "../types/user";

export default function FriendsPage() {
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [friends, setFriends] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [friendCode, setFriendCode] = useState<string>("");
  const [codeExpiry, setCodeExpiry] = useState<number | undefined>();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch user data and friends
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

        const data = userDoc.data() as UserData;
        setUserData(data);
        setFriendCode(data.friendCode || "");
        setCodeExpiry(data.friendCodeExpiry);

        // Fetch friend names
        if (data.friends && data.friends.length > 0) {
          const friendPromises = data.friends.map(async (friendId) => {
            const friendDoc = await getDoc(doc(db, "users", friendId));
            if (friendDoc.exists()) {
              return { id: friendId, name: (friendDoc.data() as UserData).name };
            }
            return null;
          });

          const fetchedFriends = await Promise.all(friendPromises);
          setFriends(fetchedFriends.filter((f): f is { id: string; name: string } => f !== null));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleGenerateCode = async () => {
    if (!user) return;
    
    try {
      const code = await generateFriendCode(user.uid);
      setFriendCode(code);
      setCodeExpiry(Date.now() + 15 * 60 * 1000);
      setMessage({ type: "success", text: "Friend code generated!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error generating code:", error);
      setMessage({ type: "error", text: "Failed to generate code" });
    }
  };

  const handleAddFriend = async (code: string) => {
    if (!user) return;

    try {
      const result = await addFriendByCode(user.uid, code);
      
      if (result.success) {
        setMessage({ type: "success", text: `Added ${result.friendName} as a friend!` });
        
        // Refresh friends list
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const data = userDoc.data() as UserData;
        
        if (data.friends && data.friends.length > 0) {
          const friendPromises = data.friends.map(async (friendId) => {
            const friendDoc = await getDoc(doc(db, "users", friendId));
            if (friendDoc.exists()) {
              return { id: friendId, name: (friendDoc.data() as UserData).name };
            }
            return null;
          });

          const fetchedFriends = await Promise.all(friendPromises);
          setFriends(fetchedFriends.filter((f): f is { id: string; name: string } => f !== null));
        }
      } else {
        setMessage({ type: "error", text: result.error || "Failed to add friend" });
      }
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error adding friend:", error);
      setMessage({ type: "error", text: "Failed to add friend" });
    }
  };

  if (authLoading || loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (!user) {
    return <div style={{ padding: 20 }}>Please log in to view friends</div>;
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h2>Friends</h2>

      {message && <MessageDisplay type={message.type} text={message.text} />}

      <FriendCodeSection 
        friendCode={friendCode}
        codeExpiry={codeExpiry}
        onGenerateCode={handleGenerateCode}
      />

      <AddFriendSection onAddFriend={handleAddFriend} />

      <FriendsList friends={friends} />
    </div>
  );
}
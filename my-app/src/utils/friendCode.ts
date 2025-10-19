// src/utils/friendCode.ts
import { doc, setDoc, getDoc, getDocs, collection, query, where, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import type { UserData } from "../types/user";

const CODE_LENGTH = 8;
const CODE_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

// Generate a random 8-character code (uppercase letters and numbers)
function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generate a new friend code for the user
export async function generateFriendCode(userId: string): Promise<string> {
  const code = generateCode();
  const expiry = Date.now() + CODE_EXPIRY_MS;

  await setDoc(
    doc(db, "users", userId),
    {
      friendCode: code,
      friendCodeExpiry: expiry,
    },
    { merge: true }
  );

  return code;
}

// Add a friend using their friend code
export async function addFriendByCode(currentUserId: string, friendCode: string): Promise<{ success: boolean; error?: string; friendName?: string }> {
  try {
    // 1. Find user with this friend code
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("friendCode", "==", friendCode));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: "Invalid friend code" };
    }

    const friendDoc = querySnapshot.docs[0];
    const friendId = friendDoc.id;
    const friendData = friendDoc.data() as UserData;

    // 2. Check if code is expired
    if (!friendData.friendCodeExpiry || friendData.friendCodeExpiry < Date.now()) {
      return { success: false, error: "Friend code has expired" };
    }

    // 3. Check if trying to add yourself
    if (friendId === currentUserId) {
      return { success: false, error: "You cannot add yourself as a friend" };
    }

    // 4. Check if already friends
    const currentUserDoc = await getDoc(doc(db, "users", currentUserId));
    const currentUserData = currentUserDoc.data() as UserData;
    
    if (currentUserData.friends?.includes(friendId)) {
      return { success: false, error: "Already friends with this user" };
    }

    // 5. Add each other as friends
    await setDoc(
      doc(db, "users", currentUserId),
      { friends: arrayUnion(friendId) },
      { merge: true }
    );

    await setDoc(
      doc(db, "users", friendId),
      { friends: arrayUnion(currentUserId) },
      { merge: true }
    );

    return { success: true, friendName: friendData.name };
  } catch (error) {
    console.error("Error adding friend:", error);
    return { success: false, error: "Failed to add friend" };
  }
}

// Check if a code is still valid (for display purposes)
export function isCodeValid(expiry?: number): boolean {
  if (!expiry) return false;
  return expiry > Date.now();
}

// Get time remaining for a code
export function getTimeRemaining(expiry?: number): string {
  if (!expiry) return "Expired";
  
  const remaining = expiry - Date.now();
  if (remaining <= 0) return "Expired";
  
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
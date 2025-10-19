import React from "react";

interface Friend {
  id: string;
  name: string;
}

interface FriendsListProps {
  friends: Friend[];
}

export default function FriendsList({ friends }: FriendsListProps) {
  return (
    <div>
      <h3>Your Friends ({friends.length})</h3>
      {friends.length === 0 ? (
        <p style={{ color: "#666" }}>No friends yet. Generate a code and share it!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {friends.map((friend) => (
            <li
              key={friend.id}
              style={{
                padding: 15,
                marginBottom: 10,
                border: "1px solid #ddd",
                borderRadius: 4,
                backgroundColor: "#f9f9f9",
              }}
            >
              {friend.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
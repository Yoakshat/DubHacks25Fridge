// src/constants/index.ts

export const APP_NAME = "FridgeMate" as const;

export const COLLECTIONS = {
  USERS: "users",
  FRIDGES: "fridges",
  IMAGES: "images",
} as const;

export const DEFAULT_FRIDGE_SIZE = {
  width: 800,
  height: 600,
};

export const COLORS = {
  background: "#f4f4f4",
  accent: "#4CAF50",
  text: "#333",
  lightGrey: "#ddd",
} as const;

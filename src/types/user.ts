// src/types/user.ts

export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url:string;
  role: "user" | "admin";
}

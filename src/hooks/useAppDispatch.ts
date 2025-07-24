// src/hooks/useAppDispatch.ts
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";

// Typed dispatch for using in components
export const useAppDispatch = () => useDispatch<AppDispatch>();

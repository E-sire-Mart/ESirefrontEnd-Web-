// src/hooks/useAppSelector.ts
import { TypedUseSelectorHook, useSelector } from "react-redux";
import type { RootState } from "../store";

// Typed selector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

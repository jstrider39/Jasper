// src/store/useStore.js
import { create } from "zustand";
import { masterSlice } from "./masterSlice";

// Define and export your store
const useStore = create((set, get) => {
  return {
    ...masterSlice(),
  };
});

export default useStore;

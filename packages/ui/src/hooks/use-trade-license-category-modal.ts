"use client";

import { create } from "zustand";
import { TenantTypes } from "@workspace/db";

interface CreateTradeLicenseCategoryModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCreateTradeLicenseCategoryModal = create<CreateTradeLicenseCategoryModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

interface EditTradeLicenseCategoryModalState {
  isOpen: boolean;
  category: TenantTypes.TradeLicenseCategory | null;
  onOpen: (category: TenantTypes.TradeLicenseCategory) => void;
  onClose: () => void;
}

export const useEditTradeLicenseCategoryModal = create<EditTradeLicenseCategoryModalState>((set) => ({
  isOpen: false,
  category: null,
  onOpen: (category) => set({ isOpen: true, category }),
  onClose: () => set({ isOpen: false, category: null }),
}));

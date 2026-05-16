"use client";

import { create } from "zustand";

// Using a generic type or defining the shape since we need to implement the UI
// In a real scenario, this would come from @workspace/db
interface FiscalYear {
  id: string;
  name: string;
  nameBn: string;
  startDate: Date;
  endDate: Date;
  isCurrent: boolean;
  isActive: boolean;
}

interface CreateFiscalYearModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCreateFiscalYearModal = create<CreateFiscalYearModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

interface EditFiscalYearModalState {
  isOpen: boolean;
  fiscalYear: FiscalYear | null;
  onOpen: (fiscalYear: FiscalYear) => void;
  onClose: () => void;
}

export const useEditFiscalYearModal = create<EditFiscalYearModalState>((set) => ({
  isOpen: false,
  fiscalYear: null,
  onOpen: (fiscalYear) => set({ isOpen: true, fiscalYear }),
  onClose: () => set({ isOpen: false, fiscalYear: null }),
}));

"use client";

import { create } from "zustand";
import { TenantTypes } from "@workspace/db";

interface CreateCertificateCounterModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCreateCertificateCounterModal = create<CreateCertificateCounterModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

interface EditCertificateCounterModalState {
  isOpen: boolean;
  counter: TenantTypes.CertificateCounter | null;
  onOpen: (counter: TenantTypes.CertificateCounter) => void;
  onClose: () => void;
}

export const useEditCertificateCounterModal = create<EditCertificateCounterModalState>((set) => ({
  isOpen: false,
  counter: null,
  onOpen: (counter) => set({ isOpen: true, counter }),
  onClose: () => set({ isOpen: false, counter: null }),
}));

import { create } from "zustand";

interface RejectCitizenModalState {
  isOpen: boolean;
  applicationId: string | null;
  applicantName: string | null;
  onConfirmCallback: ((id: string) => void) | null;
  openRejectModal: (params: {
    applicationId: string;
    applicantName: string;
    onConfirm: (id: string) => void;
  }) => void;
  closeRejectModal: () => void;
}

export const useRejectCitizenModal = create<RejectCitizenModalState>((set) => ({
  isOpen: false,
  applicationId: null,
  applicantName: null,
  onConfirmCallback: null,
  openRejectModal: ({ applicationId, applicantName, onConfirm }) =>
    set({
      isOpen: true,
      applicationId,
      applicantName,
      onConfirmCallback: onConfirm,
    }),
  closeRejectModal: () =>
    set({
      isOpen: false,
      applicationId: null,
      applicantName: null,
      onConfirmCallback: null,
    }),
}));

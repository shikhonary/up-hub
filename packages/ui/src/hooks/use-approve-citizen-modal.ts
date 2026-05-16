import { create } from "zustand";

interface ApproveCitizenModalState {
  isOpen: boolean;
  applicationId: string | null;
  applicantName: string | null;
  onConfirmCallback: ((id: string) => void) | null;
  openApproveModal: (params: {
    applicationId: string;
    applicantName: string;
    onConfirm: (id: string) => void;
  }) => void;
  closeApproveModal: () => void;
}

export const useApproveCitizenModal = create<ApproveCitizenModalState>((set) => ({
  isOpen: false,
  applicationId: null,
  applicantName: null,
  onConfirmCallback: null,
  openApproveModal: ({ applicationId, applicantName, onConfirm }) =>
    set({
      isOpen: true,
      applicationId,
      applicantName,
      onConfirmCallback: onConfirm,
    }),
  closeApproveModal: () =>
    set({
      isOpen: false,
      applicationId: null,
      applicantName: null,
      onConfirmCallback: null,
    }),
}));

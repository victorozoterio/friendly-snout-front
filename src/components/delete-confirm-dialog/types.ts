export type DeleteConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  entityLabel: string;
  isLoading?: boolean;
  onConfirm: () => void;
};

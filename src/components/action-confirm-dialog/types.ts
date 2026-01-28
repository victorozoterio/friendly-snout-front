export type ActionConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  highlightText: string;
  bodyText: string;
  confirmButtonText: string;
  isLoading?: boolean;
  onConfirm: () => void;
  confirmButtonColorScheme?: string;
};

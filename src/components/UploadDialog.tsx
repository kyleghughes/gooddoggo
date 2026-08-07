import * as Dialog from "@radix-ui/react-dialog";
import DogUploadDropzone from "./DogUploadDropzone";
import "../css/UploadDialog.css";

// #region interface
interface UploadDialogProps {
  open: boolean;
  isUploading: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
  onUploadingChange: (isUploading: boolean) => void;
}
// #endregion

const UploadDialog = ({
  open,
  isUploading,
  onClose,
  onSuccess,
  onError,
  onUploadingChange,
}: UploadDialogProps) => {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />

        <Dialog.Content
          className="dialog"
          onEscapeKeyDown={(event) => {
            if (isUploading) {
              event.preventDefault();
            }
          }}
          onPointerDownOutside={(event) => {
            if (isUploading) {
              event.preventDefault();
            }
          }}
        >
          <Dialog.Title className="dialog-title">
            Upload your doggo 🐶
          </Dialog.Title>

          <DogUploadDropzone
            onSuccess={() => {
              onClose();
              onSuccess();
            }}
            onError={onError}
            onUploadingChange={onUploadingChange}
          />

          <Dialog.Close asChild>
            <button className="close-button" aria-label="Close">
              ✕
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default UploadDialog;

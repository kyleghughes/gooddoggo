import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadDoggo } from "../services/uploadService";
import "../css/DogUploadDropzone.css";

// #region interface
interface DogUploadDropzoneProps {
  onSuccess: () => void;
  onError: (message: string) => void;
  onUploadingChange: (isUploading: boolean) => void;
}
// #endregion

const DogUploadDropzone = ({
  onSuccess,
  onError,
  onUploadingChange,
}: DogUploadDropzoneProps) => {
  // #region state
  const [isUploading, setIsUploading] = useState<boolean>(false);
  // #endregion

  // #region functions
  /**
   * Handles a successfully accepted file from the dropzone.
   *
   * Sets the uploading state, uploads the doggo image to storage,
   * and triggers either a success or error callback depending on
   * whether the upload completes successfully.
   *
   * @param acceptedFiles - Array of files accepted by the dropzone.
   */
  const onDrop = async (acceptedFiles: File[]): Promise<void> => {
    const file = acceptedFiles[0];

    if (!file) {
      return;
    }

    try {
      setIsUploading(true);
      onUploadingChange(true);

      await uploadDoggo(file);

      onSuccess();
    } catch (error) {
      console.error("Upload failed:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while uploading your doggo.";

      onError(message);
    } finally {
      setIsUploading(false);
      onUploadingChange(false);
    }
  };

  /**
   * Handles files rejected by the dropzone.
   *
   * Displays an error notification when a selected file does not
   * meet the upload requirements, such as exceeding the maximum
   * allowed file size.
   */
  const onDropRejected = (): void => {
    onError("Please select an image under 10MB.");
  };
  // #endregion

  // #region useDropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,

    accept: {
      "image/*": [],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: isUploading,
  });
  // #endregion

  return (
    <div>
      <div
        {...getRootProps()}
        className={`dropzone ${
          isDragActive ? "active" : ""
        } ${isUploading ? "uploading" : ""}`}
      >
        <input {...getInputProps()} />

        <p>
          {isUploading
            ? "Uploading your doggo... 🐶"
            : isDragActive
              ? "Drop your doggo here 🐶"
              : "Drag & drop your dog's photo here"}
        </p>

        {!isUploading && <span>or click to browse</span>}
      </div>

      <div className="guidelines">
        <h3>Upload guidelines</h3>

        <ul>
          <li>Images must be under 10MB</li>
          <li>Photos must contain a dog</li>
          <li>Please upload appropriate images</li>
          <li>Approved doggos will appear on the homepage</li>
        </ul>
      </div>
    </div>
  );
};

export default DogUploadDropzone;

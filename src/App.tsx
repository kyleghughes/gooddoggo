import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import UploadDialog from "./components/UploadDialog";
import Toast from "./components/Toast";
import { getRandomDoggo } from "./services/imageService";
import GoodDoggoLogo from "../src/assets/GoodDoggoLogo.png";
import "../src/css/App.css";

// #region interface
interface ToastState {
  message: string;
  type: "success" | "error";
}
// #endregion

const App = () => {
  // #region state
  const [uploadOpen, setUploadOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  // #endregion

  // #region useQuery
  const { data: image, isLoading } = useQuery({
    queryKey: ["doggo-image"],
    queryFn: getRandomDoggo,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  // #endregion

  return (
    <main className="page">
      <div className="content-card">
        <header className="logo-container">
          <img src={GoodDoggoLogo} alt="Good Doggo" className="logo" />
        </header>

        <section className="image-container">
          {isLoading ? (
            <div className="loader">Loading doggo...</div>
          ) : (
            image && (
              <img src={image} alt="Random doggo" className="dog-image" />
            )
          )}
        </section>

        <button className="upload-button" onClick={() => setUploadOpen(true)}>
          Upload your doggo
        </button>

        <UploadDialog
          open={uploadOpen}
          onClose={() => {
            if (!isUploading) {
              setUploadOpen(false);
            }
          }}
          onSuccess={() => {
            setUploadOpen(false);

            setToast({
              message:
                "Doggo uploaded successfully! It will appear once approved 🐶",
              type: "success",
            });
          }}
          onError={(message) => {
            setToast({
              message,
              type: "error",
            });
          }}
          onUploadingChange={setIsUploading}
          isUploading={isUploading}
        />
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
};

export default App;

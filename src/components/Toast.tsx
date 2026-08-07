import { useEffect } from "react";
import "../css/Toast.css";

// #region interface
interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}
// #endregion

const Toast = ({ message, type, onClose }: ToastProps) => {
  // #region useEffect
  /**
   * Automatically closes the component after 5 seconds.
   *
   * Creates a timeout that calls the onClose callback once the
   * duration has elapsed. The cleanup function clears the timeout
   * if the component unmounts or the onClose dependency changes,
   * preventing unnecessary function calls or memory leaks.
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timeout);
  }, [onClose]);
  // #endregion

  return (
    <div className={`toast toast-${type}`} role="alert">
      <span>{message}</span>

      <button type="button" onClick={onClose} aria-label="Close notification">
        ×
      </button>
    </div>
  );
};

export default Toast;

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showSuccessToast = (message) => {
  toast.success(message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    icon: "✅",
    className: 'toast-success',
    style: {
      backgroundColor: '#28a745',
      color: '#fff',
      borderRadius: '8px',
      padding: '10px 20px',
      fontWeight: 'bold',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#28a745',
    }
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    icon: "❌",
    className: 'toast-error',
    style: {
      backgroundColor: '#dc3545',
      color: '#fff',
      borderRadius: '8px',
      padding: '10px 20px',
      fontWeight: 'bold',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#dc3545',
    }
  });
};
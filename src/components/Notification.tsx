import React from "react";

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  return (
    <div className="fixed top-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg">
      <p>{message}</p>
      <button onClick={onClose} className="mt-2 text-blue-400 hover:underline">
        Cerrar
      </button>
    </div>
  );
};

export default Notification;

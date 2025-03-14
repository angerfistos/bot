const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-2">{message}</p>
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 mr-2 text-white bg-gray-400 rounded"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 text-white bg-red-500 rounded"
            onClick={onConfirm}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

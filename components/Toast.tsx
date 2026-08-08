interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-6 right-6 z-50 flex items-center gap-3
                 rounded-xl border border-green-200 bg-white px-4 py-3
                 text-sm font-medium text-green-700 shadow-lg"
    >
      <span>✓</span>

      <span>{message}</span>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="ml-2 text-gray-400 hover:text-gray-700 cursor-pointer"
      >
        ×
      </button>
    </div>
  );
}

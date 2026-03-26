import { useEffect } from 'react';

/**
 * Toast Component
 * Slides in from the top-right to show success/error feedback.
 * Auto-dismissed by the context after 4 seconds.
 *
 * Props:
 *   message {string}
 *   type    'success' | 'error' | 'info'
 *   onClose {function}
 */
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    // Allow CSS animation to complete before removal
    const t = setTimeout(onClose, 3800);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`toast toast--${type}`} role="alert" aria-live="polite">
      <span className="toast__icon">
        {type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
      </span>
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={onClose} aria-label="Dismiss">×</button>
    </div>
  );
};

export default Toast;
